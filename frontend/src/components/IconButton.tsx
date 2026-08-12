/** @format */

interface buttonProps {
  icon?: string;
  alternate?: string;
  content: string;
}

const IconButton = ({ icon, alternate, content }: buttonProps) => {
  return (
    <section className="inline-flex items-center gap-2 rounded-full bg-[#ffffff0d] px-4 py-2 hover:border hover:border-blue-400">
      <img
        src={icon}
        alt={alternate}
        width={17}
        height={17}
        className="object-contain rounded-full"
      />
      <p className="text-[14px] lg:text-[12px] font-medium">{content}</p>
    </section>
  );
};

export default IconButton;
