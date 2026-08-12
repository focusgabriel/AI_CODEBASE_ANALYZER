/** @format */

interface readProps {
  title: string;
  content: string;
}
const Read = ({ title, content }: readProps) => {
  return (
    <div className="text-center sm:text-left">
      <h2 className="text-blue-500 text-3xl font-semibold text-center">{title}</h2>
      <p className="text-gray-400 text-[14px] tracking-wide mt-2 sm:ml-4">
        {content}
      </p>
    </div>
  );
};

export default Read;
