/** @format */

interface buttonProps {
  icon?: string;
  alternate?: string;
  content: string;
}

const Button = ({ icon, alternate, content }: buttonProps) => {
  return (
    <div className="rounded-lg border border-amber-300 p-2">
      <div className="w-[20%]">
        <img src={icon} alt={alternate} width={20} height={20} />
      </div> 
      <p>{content}</p>
    </div>
  );
};

export default Button;
