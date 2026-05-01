interface AlertProps {
  type: "success" | "error";
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  const colors =
    type === "success"
      ? "bg-green-50 border-green-400 text-green-800"
      : "bg-red-50 border-red-400 text-red-800";
  return (
    <div className={`border-l-4 px-4 py-3 rounded text-sm ${colors}`}>
      {message}
    </div>
  );
}
