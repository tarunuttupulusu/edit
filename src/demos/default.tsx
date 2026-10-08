import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function ParallaxDemo() {
  return (
    <>
      <ParallaxComponent />
      <div className="osmo-credits py-4 text-center text-xs text-white/50">
        <p className="osmo-credits__p">
          Resource by{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.osmo.supply/"
            className="osmo-credits__p-a text-gaude-orange underline"
          >
            Osmo
          </a>
        </p>
      </div>
    </>
  );
}
