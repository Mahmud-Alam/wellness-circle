import { LoaderCircle } from "lucide-react";

export default function Loader({ fullScreen = false, label = "Loading..." }) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-50"
          : "flex items-center justify-center py-10"
      }
    >
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle
          size={32}
          className="animate-spin text-emerald-500"
          strokeWidth={2}
        />

        {label && <p className="text-sm text-slate-500">{label}</p>}
      </div>
    </div>
  );
}
