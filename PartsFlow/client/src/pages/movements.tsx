import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Plus, Package, Calendar } from "lucide-react";
import { MovementWithPart } from "@shared/schema";
import { format } from "date-fns";

export default function Movements() {
  const { data: movements, isLoading } = useQuery<MovementWithPart[]>({
    queryKey: ["/api/movements"],
  });

  const getMovementIcon = (type: string) => {
    return type === 'in' ? ArrowUp : ArrowDown;
  };

  const getMovementColor = (type: string) => {
    return type === 'in' ? 'text-green-600' : 'text-red-600';
  };

  const getMovementBgColor = (type: string) => {
    return type === 'in' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <>
      <Header 
        title="Stock Movements" 
        description="Track all inventory movements and transactions" 
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Recent Movements</h3>
          <div className="flex items-center space-x-3">
            <Button data-testid="button-stock-in-movement">
              <ArrowUp className="w-4 h-4 mr-2" />
              Stock In
            </Button>
            <Button variant="outline" data-testid="button-stock-out-movement">
              <ArrowDown className="w-4 h-4 mr-2" />
              Stock Out
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-8 w-16 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : movements && movements.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200">
                {movements.map((movement) => {
                  const Icon = getMovementIcon(movement.type);
                  return (
                    <div 
                      key={movement.id} 
                      className="p-6 hover:bg-slate-50 transition-colors"
                      data-testid={`row-movement-${movement.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getMovementBgColor(movement.type)}`}>
                            <Icon className={`w-5 h-5 ${getMovementColor(movement.type)}`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-slate-900" data-testid={`text-movement-part-${movement.id}`}>
                                {movement.part.name}
                              </h4>
                              <Badge variant="outline" data-testid={`badge-movement-type-${movement.id}`}>
                                {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span data-testid={`text-movement-part-number-${movement.id}`}>
                                Part #{movement.part.partNumber}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span data-testid={`text-movement-date-${movement.id}`}>
                                  {movement.createdAt ? format(new Date(movement.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                </span>
                              </div>
                            </div>
                            {movement.reason && (
                              <p className="text-sm text-slate-600 mt-1" data-testid={`text-movement-reason-${movement.id}`}>
                                {movement.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${getMovementColor(movement.type)}`} data-testid={`text-movement-quantity-${movement.id}`}>
                            {movement.type === 'in' ? '+' : '-'}{movement.quantity} units
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h4 className="text-lg font-semibold text-slate-900 mb-2">No Movements Found</h4>
              <p className="text-slate-600 mb-4">Stock movements will appear here as you add or remove inventory</p>
              <div className="flex items-center justify-center space-x-3">
                <Button data-testid="button-add-stock-in">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Stock In
                </Button>
                <Button variant="outline" data-testid="button-add-stock-out">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Stock Out
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
