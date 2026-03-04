import { useText } from '../hooks/useText';

const Advertising = () => {
  const advertText = useText('Advertise');

  return (
    <div className="container-editorial py-12">
      <h1 className="font-serif text-3xl font-bold mb-6">{advertText}</h1>
      <p className="mb-4 text-editorial-muted dark:text-zinc-400">
        We invite businesses and organizations to advertise on Lokawani. Our audience is
        engaged, local, and growing – the perfect place to get your message across.
      </p>
      <h2 className="font-semibold mt-8 mb-2">Monthly Plans</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">₹5,000 – Sidebar banner</h3>
          <p className="text-sm text-editorial-muted dark:text-zinc-400">300×250 pixels, appears alongside articles.</p>
          <div className="mt-2 w-[300px] h-[250px] border-2 border-dashed border-editorial-border flex items-center justify-center text-editorial-muted text-xs">
            Sidebar ad preview
          </div>
        </div>
        <div>
          <h3 className="font-semibold">₹10,000 – Header banner</h3>
          <p className="text-sm text-editorial-muted dark:text-zinc-400">728×90 pixels, shown at top of every page.</p>
          <div className="mt-2 w-full max-w-[728px] h-[90px] border-2 border-dashed border-editorial-border flex items-center justify-center text-editorial-muted text-xs">
            Header ad preview
          </div>
        </div>
        <div>
          <h3 className="font-semibold">₹15,000 – Homepage takeover</h3>
          <p className="text-sm text-editorial-muted dark:text-zinc-400">Full-width banner on the homepage.</p>
          <div className="mt-2 w-full h-[150px] border-2 border-dashed border-editorial-border flex items-center justify-center text-editorial-muted text-xs">
            Homepage takeover preview
          </div>
        </div>
      </div>
      <p className="mt-6 mb-4 text-editorial-muted dark:text-zinc-400">
        All plans include performance reports, creative support, and priority placement. Custom
        packages are available – just get in touch.
      </p>
      <p className="text-editorial-red font-semibold">
        For more details or to book a slot, please <a href="mailto:ads@lokawani.example" className="underline">contact us</a> or call <a href="tel:+919876543210" className="underline">+91 98765 43210</a>.
      </p>
    </div>
  );
};

export default Advertising;
