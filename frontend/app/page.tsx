'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function Home() {

  const [input, setInput] = useState("");
  const [characterOutput, setCharacterOutput] = useState("");
  const [summaryOutput, setSummaryOutput] = useState("");
  const [haiku, setHaiku] = useState("");
  const [mode, setMode] = useState<"summary" | "character">("summary");
  const [character, setCharacter] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>日報を入力してねん</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-48 bg-blue-50" placeholder="ここに書いてね" value={input} onChange={(e) => setInput(e.target.value)} />
          </CardContent>
        </Card>
        <div className="flex gap-3 my-4">
          <div className="flex gap-3 flex-1">
            <RadioGroup
              className="flex items-center gap-4"
              value={mode}
              onValueChange={(value) => setMode(value as "summary" | "character")}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="mode-summary" value="summary" />
                <label htmlFor="mode-summary">要約🤖</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="mode-character" value="character" />
                <label htmlFor="mode-character">語尾変換🥸</label>
              </div>
            </RadioGroup>

            {mode === "character" && (
              <div className="flex-1 min-w-[200px]">
                <input
                  className="w-full rounded border border-slate-500 px-3 py-2 text-sm"
                  placeholder="キャラクター（例: クレヨンしんちゃん, 関西弁, 女の子など）"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <Button 
            className="bg-blue-400 text-white" 
            variant="outline" 
            disabled={loading || !input || (!character && mode==="character")} 
            onClick={async () => {
              try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";
                const response = await fetch(`${apiUrl}/transform`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ inputText: input, mode, characterName: character }),
                });
                
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                if (mode === "summary") {
                  setSummaryOutput(data.output);
                } else {
                  setCharacterOutput(data.output);
                }
                setHaiku(data.haiku);
              } catch (error) {
                console.error("Error:", error);
                if (mode === "summary") {
                  setSummaryOutput(`エラーが発生しました: ${error}`);
                } else {
                  setCharacterOutput(`エラーが発生しました: ${error}`);
                }
              } finally {
                setLoading(false);
              }
            }}>{loading ? "ドキドキ..." : "変換する"}
          </Button>
        </div>
        <Card>
          <CardHeader> 
            {mode === "summary" ? <CardTitle>要約🤖</CardTitle> : <CardTitle>語尾変換🥸</CardTitle>}
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-48 bg-green-50" value={mode === "summary" ? summaryOutput : characterOutput} onChange={(e) => mode === "summary" ? setSummaryOutput(e.target.value) : setCharacterOutput(e.target.value)} />
          </CardContent>
        </Card>
        <Card className="my-4">
          <CardHeader>
            <CardTitle>本日の一句🐇</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-24 bg-green-100" value={haiku} onChange={(e) => setHaiku(e.target.value)} />
          </CardContent>
        </Card>
    </main>
  );
}
