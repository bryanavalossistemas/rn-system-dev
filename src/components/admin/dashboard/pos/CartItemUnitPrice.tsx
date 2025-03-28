import { SaleForm } from '@/schemas/sales';
import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

interface CartItemUnitPriceProps {
  unitPrice: number;
  id: number;
}

export default function CartItemUnitPrice({ id, unitPrice }: CartItemUnitPriceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayValue, setDisplayValue] = useState(unitPrice.toFixed(2));
  const inputRef = useRef<HTMLInputElement>(null);

  const { setValue, getValues } = useFormContext<SaleForm>();

  useEffect(() => {
    setDisplayValue(unitPrice.toFixed(2));
  }, [unitPrice]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setDisplayValue(value);
    }
  };

  const handleBlur = () => {
    let numericValue = parseFloat(displayValue);

    if (isNaN(numericValue) || numericValue < 0) {
      numericValue = 0;
    }

    numericValue = parseFloat(numericValue.toFixed(2));

    setValue(
      'documentDetails',
      getValues('documentDetails').map((d) => (d.id === id ? { ...d, unitPrice: numericValue } : d)),
    );

    setDisplayValue(numericValue.toFixed(2));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setDisplayValue(unitPrice.toFixed(2));
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input
      id="unitPrice"
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      className="focus-visible:outline-ring rounded-md px-1 py-0.5 w-full"
    />
  ) : (
    <span className="hover:bg-accent hover:cursor-pointer select-none rounded-md px-1 py-0.5 w-full" onDoubleClick={handleDoubleClick}>
      {displayValue}
    </span>
  );
}
