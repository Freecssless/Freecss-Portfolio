/** Label that rolls up on hover (the copy is drawn by CSS from data-text). */
export default function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span data-text={children}>{children}</span>
    </span>
  );
}
