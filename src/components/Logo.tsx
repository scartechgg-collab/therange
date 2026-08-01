interface LogoProps {
  size?: number;
  glow?: boolean;
}

export function Logo({ size = 40, glow = true }: LogoProps) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <img
        src="https://i.postimg.cc/jjg0wsJm/logo.png"
        alt="Range Cloud Hosting"
        width={size}
        height={size}
        draggable={false}
        className="w-full h-full object-contain rounded-full select-none"
      />
      {glow && (
        <div
          className="absolute -inset-1 rounded-full bg-primary/25 blur-md -z-10 animate-pulse-glow"
          style={{ animationDuration: '5s' }}
        />
      )}
    </div>
  );
}
