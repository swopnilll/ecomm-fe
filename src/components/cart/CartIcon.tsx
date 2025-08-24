import { ShoppingCartIcon } from "@heroicons/react/24/outline";

interface CartIconProps {
  onClick: () => void;
  itemCount: number;
}

const CartIcon = ({ onClick, itemCount }: CartIconProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative p-2 text-gray-400 hover:text-gray-500"
    >
      <span className="absolute -inset-0.5" />
      <span className="sr-only">View cart</span>
      <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 text-white text-xs font-bold">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
