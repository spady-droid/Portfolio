import Image from "next/image";

// Emoldura um print pra ficar bonito:
// - "mobile"  -> moldura de celular
// - "desktop" -> moldura de janela de navegador (3 bolinhas)
export function Mockup({
  src,
  alt,
  formato,
}: {
  src: string;
  alt: string;
  formato: "mobile" | "desktop";
}) {
  if (formato === "mobile") {
    return (
      <div className="mx-auto w-full max-w-[240px] rounded-[2rem] border-[6px] border-zinc-800 bg-zinc-800 shadow-xl dark:border-zinc-700 dark:bg-zinc-700">
        <div className="relative aspect-[9/20] w-full overflow-hidden rounded-[1.5rem]">
          <Image src={src} alt={alt} fill className="object-cover" sizes="240px" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-300 shadow-lg dark:border-zinc-700">
      <div className="flex items-center gap-1.5 bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      </div>
      <div className="relative aspect-video w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
    </div>
  );
}
