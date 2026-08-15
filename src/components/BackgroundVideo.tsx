export function BackgroundVideo({ dim = 0.35 }: { dim?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
          type="video/mp4"
        />
      </video>
      <div
        className="absolute inset-0 bg-background"
        style={{ opacity: dim }}
        aria-hidden="true"
      />
    </div>
  );
}
