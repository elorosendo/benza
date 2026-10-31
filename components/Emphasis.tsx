// "Cuidado íntimo" -> Cuidado <em>íntimo</em>. Palavra única fica sem ênfase.
export function Emphasis({ text }: { text: string }) {
  const words = text.split(" ");
  if (words.length < 2) return <>{text}</>;
  return (
    <>
      {words[0]} <em>{words.slice(1).join(" ")}</em>
    </>
  );
}
