
import { useState } from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";

// Color constants for chart elements
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function SubscriptionChart() {
  const [chartType, setChartType] = useState<"category" | "cost">("cost");
  const { subscriptions } = useSubscriptions();
  
  // Only show active subscriptions in the charts
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  
  // Prepare cost-by-billing-cycle data
  const costByBillingCycle = [
    { name: 'Weekly', value: 0, color: '#FF8042' },
    { name: 'Monthly', value: 0, color: '#0088FE' },
    { name: 'Quarterly', value: 0, color: '#00C49F' },
    { name: 'Yearly', value: 0, color: '#FFBB28' },
  ];
  
  // Prepare category data
  const categoryData: { [key: string]: number } = {};
  
  activeSubscriptions.forEach(sub => {
    // Add to cost by billing cycle
    const index = costByBillingCycle.findIndex(item => 
      item.name.toLowerCase() === sub.billingCycle
    );
    
    if (index !== -1) {
      costByBillingCycle[index].value += sub.cost;
    }
    
    // Add to category data
    const category = sub.category.charAt(0).toUpperCase() + sub.category.slice(1);
    if (categoryData[category]) {
      categoryData[category] += sub.cost;
    } else {
      categoryData[category] = sub.cost;
    }
  });
  
  // Convert category data to array format for charts
  const categoryChartData = Object.keys(categoryData).map((category, index) => ({
    name: category,
    value: categoryData[category],
    color: COLORS[index % COLORS.length]
  }));
  
  // Format the tooltip value as currency
  const formatTooltipValue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {activeSubscriptions.length === 0 
            ? "No active subscriptions to display" 
            : `Showing data for ${activeSubscriptions.length} active subscription${activeSubscriptions.length !== 1 ? 's' : ''}`}
        </div>
        <Select
          value={chartType}
          onValueChange={(value) => setChartType(value as "category" | "cost")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cost">Cost by Billing Cycle</SelectItem>
            <SelectItem value="category">Cost by Category</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {activeSubscriptions.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          {chartType === "cost" ? (
            <BarChart
              data={costByBillingCycle.filter(item => item.value > 0)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']} />
              <Legend />
              <Bar dataKey="value" name="Total Cost" radius={[4, 4, 0, 0]}>
                {costByBillingCycle.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
}
