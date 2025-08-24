import { useCart } from "../../hooks/cart/useCart";
import { FaShoppingCart } from "react-icons/fa";

interface CartIconProps {
  onClick: () => void;
}

export default function CartIcon({ onClick }: CartIconProps) {
  const { cart } = useCart();
  return (
    <button className="relative p-2" onClick={onClick}>
      <FaShoppingCart className="h-6 w-6 text-gray-700" />
      {cart.itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
          {cart.itemCount}
        </span>
      )}
    </button>
  );
}