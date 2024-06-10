import { HTMLAttributes } from "react";
import { IoTrashOutline } from "react-icons/io5";
interface ButtonDeleteProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  className?: string;
  disabled: boolean;
  sizeIcon?:number
}
const ButtonDelete = ({
  onClick,
  className,
  sizeIcon,
  disabled,
  ...rest
}: ButtonDeleteProps) => {
  return (
    <button {...rest} data-cy='delete-my-profile-item-btn' disabled={disabled} onClick={onClick} className={className}>
      <p className={"flex items-center gap-1.5 text-destructive"}>
        <IoTrashOutline className='text-destructive' size={sizeIcon}/>
        Xóa
      </p>
    </button>
  );
};

export default ButtonDelete;
