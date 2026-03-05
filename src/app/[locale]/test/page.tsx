"use client";

import { useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useTestStore } from "@/stores/test-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useCountdown } from "@/hooks/useCountdown";
import { useSessionRecorder } from "@/hooks/useSessionRecorder";
import { generateText } from "@/lib/engine/generator";
import { TextDisplay } from "@/components/arena/TextDisplay";
import { InputCapture } from "@/components/arena/InputCapture";
import { ProgressBar } from "@/components/arena/ProgressBar";
import { ResultScreen } from "@/components/arena/ResultScreen";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TestPage() {
  const t = useTranslations("test");
  const tHome = useTranslations("home");
  const status = useTestStore((s) => s.status);
  const setTargetText = useTestStore((s) => s.setTargetText);
  const setDuration = useTestStore((s) => s.setDuration);
  const reset = useTestStore((s) => s.reset);
  const { mode, language, duration, setMode, setDuration: setSettingsDuration } = useSettingsStore();

  useCountdown();
  useSessionRecorder();

  const initTest = useCallback(() => {
    const wordCount = mode === "sentences" ? 50 : Math.max(20, Math.round(duration * 1.5));
    const text = generateText(mode, language, wordCount);
    reset();
    setDuration(duration);
    setTargetText(text);
  }, [mode, language, duration, reset, setDuration, setTargetText]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  const handleRestart = () => {
    initTest();
  };

  const handleDurationChange = (val: string) => {
    const d = parseInt(val);
    setSettingsDuration(d);
    if (status === "idle") {
      setDuration(d);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={mode} onValueChange={(v) => { setMode(v as "words" | "sentences"); }}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="words">{tHome("modeWords")}</SelectItem>
            <SelectItem value="sentences">{tHome("modeSentences")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={duration.toString()} onValueChange={handleDurationChange}>
          <SelectTrigger className="w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15s</SelectItem>
            <SelectItem value="30">30s</SelectItem>
            <SelectItem value="60">60s</SelectItem>
          </SelectContent>
        </Select>

        {status !== "idle" && (
          <Button variant="outline" size="sm" onClick={handleRestart}>
            {t("restart")}
          </Button>
        )}
      </div>

      {status === "finished" ? (
        <ResultScreen onRestart={handleRestart} />
      ) : (
        <div className="space-y-4">
          <ProgressBar />
          <div className="relative">
            <TextDisplay />
            <InputCapture />
          </div>
        </div>
      )}
    </div>
  );
}
