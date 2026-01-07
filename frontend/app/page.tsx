'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Home() {

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
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
            setLoading(true);
            const response = await fetch("http://localhost:3005/transform", {
              method: "POST",
              body: JSON.stringify({ text: input }),
            });
            const data = await response.json();
            setOutput(data.output);
            setLoading(false);
          }}>{loading ? "ドキドキ..." : "変換するう！！"}</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>変換後！！</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-48 bg-green-50" value={output} onChange={(e) => setOutput(e.target.value)} />
          </CardContent>
        </Card>
    </main>
  );
}
