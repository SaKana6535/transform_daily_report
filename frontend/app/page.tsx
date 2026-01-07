'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Home() {

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [haiku, setHaiku] = useState("");
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
        <div className="flex justify-center">
          <Button className="my-4 bg-blue-400 text-white" variant="outline" disabled={loading || !input} onClick={async () => {
            try {
              setLoading(true);
              const apiUrl = process.env.NEXT_PUBLIC_API_URL;
              const response = await fetch(`${apiUrl}/transform`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputText: input }),
              });
              
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              
              const data = await response.json();
              setOutput(data.output);
              setHaiku(data.haiku);
            } catch (error) {
              console.error("Error:", error);
              setOutput(`エラーが発生しました: ${error}`);
            } finally {
              setLoading(false);
            }
          }}>{loading ? "ドキドキ..." : "変換するう"}</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>トランスフォーム後🤖</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-48 bg-green-50" value={output} onChange={(e) => setOutput(e.target.value)} />
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
