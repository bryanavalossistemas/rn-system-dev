import { SaleForm } from '@/schemas/sales';
import { useFormContext } from 'react-hook-form';
import { ShoppingCart, MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import CartItemProductName from '@/components/admin/dashboard/pos/CartItemProductName';
import CartItemUnitPrice from '@/components/admin/dashboard/pos/CartItemUnitPrice';

interface RightPanelBodyProps {
  documentDetails: SaleForm['documentDetails'];
}

export default function RightPanelBody({ documentDetails }: RightPanelBodyProps) {
  const { control, setValue } = useFormContext<SaleForm>();

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <FormField
        control={control}
        name="documentDetails"
        render={() =>
          documentDetails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={48} strokeWidth={1} />
              <p className="mt-2 text-lg">Tu comprobante está vacío</p>
              <p className="text-sm">Añade productos haciendo clic en ellos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentDetails.map((item) => {
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2 border rounded-sm text-sm">
                    <img
                      src={item.product.images ? (item.product.images[0]?.path ?? '/placeholder.svg') : '/placeholder.svg'}
                      alt={item.productName}
                      className=" object-cover w-16 h-16 rounded shrink-0 shadow-sm"
                    />
                    <div className="flex-1">
                      <CartItemProductName id={item.id} productName={item.productName} />
                      <div className="flex items-center font-semibold">
                        <span className="mr-1">S/.</span>
                        <CartItemUnitPrice id={item.id} unitPrice={item.unitPrice} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          if (item.quantity === 1) {
                            setValue(
                              'documentDetails',
                              documentDetails.filter((d) => d.id !== item.id),
                            );
                            return;
                          }

                          setValue(
                            'documentDetails',
                            documentDetails.map((d) => (d.id === item.id ? { ...item, quantity: item.quantity - 1 } : d)),
                          );
                        }}
                      >
                        <MinusIcon strokeWidth={3} />
                      </Button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setValue(
                            'documentDetails',
                            documentDetails.map((d) => (d.id === item.id ? { ...item, quantity: item.quantity + 1 } : d)),
                          );
                        }}
                      >
                        <PlusIcon strokeWidth={3} />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      className="h-6 w-6 hover:text-red-500 cursor-pointer shrink-0"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setValue(
                          'documentDetails',
                          documentDetails.filter((d) => d.id !== item.id),
                        );
                      }}
                    >
                      <XIcon strokeWidth={2} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )
        }
      />
    </div>
  );
}
