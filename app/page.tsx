import Image from "next/image";

export default function Home() {
  return (
    <main className="container-benza flex flex-1 flex-col items-center justify-center gap-8 py-24 text-center">
      <Image
        src="/assets/brand/wordmark-coralsoft.svg"
        alt="BENZA"
        width={360}
        height={93}
        priority
      />
      <Image
        src="/assets/brand/tagline-sand.svg"
        alt="the good kind of secret"
        width={160}
        height={166}
      />
      <p className="label text-sand/75">[Setup concluído — home em construção]</p>
    </main>
  );
}
