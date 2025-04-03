
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Subscription } from "@/types/subscription";
import { cn, formatCurrency, getDaysUntilRenewal } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface SubscriptionCalendarProps {
  subscriptions: Subscription[];
}

export function SubscriptionCalendar({ subscriptions }: SubscriptionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get subscriptions due in current month
  const subscriptionsByDay: { [key: string]: Subscription[] } = {};
  
  subscriptions.forEach(subscription => {
    if (subscription.status === 'active') {
      const nextBillingDate = subscription.nextBillingDate;
      if (nextBillingDate >= monthStart && nextBillingDate <= monthEnd) {
        const dateKey = format(nextBillingDate, 'yyyy-MM-dd');
        if (!subscriptionsByDay[dateKey]) {
          subscriptionsByDay[dateKey] = [];
        }
        subscriptionsByDay[dateKey].push(subscription);
      }
    }
  });
  
  // Handle month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };
  
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };
  
  // Calculate week rows with proper offsets for first day
  const firstDayOfMonth = getDay(monthStart);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = [...blanks.map(() => null), ...daysInMonth];
  const weeks = [];
  let week = [];
  
  for (let i = 0; i < days.length; i++) {
    week.push(days[i]);
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  }
  
  // Pad last week if needed
  if (week.length > 0 && week.length < 7) {
    const padding = Array(7 - week.length).fill(null);
    weeks.push([...week, ...padding]);
  }
  
  // Get total renewals for the month
  const totalRenewals = Object.values(subscriptionsByDay).reduce(
    (sum, subs) => sum + subs.length,
    0
  );
  
  // Calculate total cost for renewals this month
  const totalCost = Object.values(subscriptionsByDay).reduce(
    (sum, subs) => sum + subs.reduce((subSum, sub) => subSum + sub.cost, 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-base font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
            Today
          </Button>
          <div className="flex items-center space-x-2">
            <Badge>{totalRenewals} renewal{totalRenewals !== 1 ? 's' : ''}</Badge>
            {totalCost > 0 && (
              <Badge variant="secondary">{formatCurrency(totalCost)}</Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="grid grid-cols-7 border-b text-center text-xs font-medium">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={i} className="py-2 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 divide-x divide-y">
          {weeks.map((week, weekIndex) => (
            week.map((day, dayIndex) => {
              const dateKey = day ? format(day, 'yyyy-MM-dd') : '';
              const isToday = day ? format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') : false;
              const hasSubscriptions = day && subscriptionsByDay[dateKey]?.length > 0;
              
              return (
                <div 
                  key={`${weekIndex}-${dayIndex}`} 
                  className={cn(
                    "min-h-[85px] p-1 relative",
                    !day && "bg-muted/20",
                    isToday && "bg-primary/5",
                  )}
                >
                  {day && (
                    <>
                      <span className={cn(
                        "text-xs inline-block w-6 h-6 rounded-full text-center leading-6 font-medium",
                        isToday && "bg-primary text-primary-foreground"
                      )}>
                        {format(day, 'd')}
                      </span>
                      
                      {hasSubscriptions && (
                        <div className="mt-1 space-y-1">
                          {subscriptionsByDay[dateKey].slice(0, 3).map((sub, i) => (
                            <div 
                              key={sub.id}
                              className="text-xs p-1 rounded bg-muted truncate flex items-center space-x-1"
                            >
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: sub.color || '#10b981' }}
                              />
                              <span className="truncate">{sub.name}</span>
                            </div>
                          ))}
                          
                          {subscriptionsByDay[dateKey].length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              + {subscriptionsByDay[dateKey].length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
      
      <h4 className="font-medium text-sm mt-6 mb-2">
        Upcoming Renewals ({totalRenewals})
      </h4>
      
      <ScrollArea className="h-[120px]">
        <div className="space-y-2">
          {Object.entries(subscriptionsByDay)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([date, subs]) => (
              <div key={date} className="text-sm">
                <div className="font-medium">
                  {format(new Date(date), 'EEEE, MMMM d')}
                </div>
                <div className="mt-1 space-y-1">
                  {subs.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: sub.color || '#10b981' }}
                        />
                        <span>{sub.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(sub.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
          {totalRenewals === 0 && (
            <div className="text-muted-foreground py-2">
              No upcoming renewals this month
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
