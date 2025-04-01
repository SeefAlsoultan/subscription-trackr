import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Subscription, SubscriptionFormData, SubscriptionCategory } from "@/types/subscription";
import { subscriptionServices } from "./SubscriptionServiceSelect";
import { connectToSubscriptionService } from "@/lib/serviceConnection";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Subscription name must be at least 2 characters",
  }),
  description: z.string().optional(),
  url: z.string().url({
    message: "Please enter a valid URL",
  }).optional().or(z.literal("")),
  cost: z.coerce.number().min(0, {
    message: "Cost must be a positive number",
  }),
  billingCycle: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  category: z.enum(["entertainment", "software", "music", "news", "gaming", "other"]),
  startDate: z.date(),
  nextBillingDate: z.date(),
  status: z.enum(["active", "pending", "cancelled", "expired"]),
});

export interface SubscriptionFormProps {
  mode: "add" | "edit";
  subscriptionId?: string;
  onClose: () => void;
  preselectedService?: string;
}

export function SubscriptionForm({
  mode,
  subscriptionId,
  onClose,
  preselectedService,
}: SubscriptionFormProps) {
  const { addSubscription, updateSubscription, getSubscriptionById } =
    useSubscriptions();
  const [loading, setLoading] = useState(false);
  
  // Get subscription data if in edit mode
  const subscriptionToEdit = subscriptionId
    ? getSubscriptionById(subscriptionId)
    : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      cost: 0,
      billingCycle: "monthly",
      category: "other",
      startDate: new Date(),
      nextBillingDate: new Date(),
      status: "active",
    },
  });

  // Load existing subscription data if in edit mode
  useEffect(() => {
    if (mode === "edit" && subscriptionToEdit) {
      form.reset({
        name: subscriptionToEdit.name,
        description: subscriptionToEdit.description || "",
        url: subscriptionToEdit.url || "",
        cost: subscriptionToEdit.cost,
        billingCycle: subscriptionToEdit.billingCycle,
        category: subscriptionToEdit.category,
        startDate: subscriptionToEdit.startDate,
        nextBillingDate: subscriptionToEdit.nextBillingDate,
        status: subscriptionToEdit.status,
      });
    }
  }, [mode, subscriptionToEdit, form]);
  
  // Handle preselected service if provided
  useEffect(() => {
    if (mode === "add" && preselectedService) {
      const service = subscriptionServices.find(s => s.id === preselectedService);
      if (service) {
        // Fetch subscription details if available
        setLoading(true);
        connectToSubscriptionService(service.id).then(info => {
          if (info) {
            form.setValue("name", service.name);
            form.setValue("cost", info.cost);
            form.setValue("billingCycle", info.billingCycle);
            form.setValue("nextBillingDate", info.nextBillingDate);
            form.setValue("startDate", info.startDate);
            form.setValue("status", info.status);
            form.setValue("category", mapServiceToCategory(service.id));
            
            // Set URL for the service
            const serviceData = subscriptionServices.find(s => s.id === service.id);
            if (serviceData && serviceData.url) {
              const url = new URL(serviceData.url);
              const baseUrl = `${url.protocol}//${url.hostname}`;
              form.setValue("url", baseUrl);
            }
          }
          setLoading(false);
        });
      }
    }
  }, [preselectedService, mode, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (mode === "add") {
      addSubscription(data as SubscriptionFormData);
    } else if (mode === "edit" && subscriptionId) {
      updateSubscription(subscriptionId, data as SubscriptionFormData);
    }
    onClose();
  };

  // Map service ID to subscription category
  const mapServiceToCategory = (serviceId: string): SubscriptionCategory => {
    const categoryMap: Record<string, SubscriptionCategory> = {
      netflix: "entertainment",
      spotify: "music",
      disney: "entertainment",
      hulu: "entertainment",
      amazon: "entertainment",
      youtube: "entertainment",
      appletv: "entertainment",
      hbomax: "entertainment",
    };
    
    return categoryMap[serviceId] || "other";
  };

  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>{mode === "add" ? "Add New" : "Edit"} Subscription</DialogTitle>
        <DialogDescription>
          {mode === "add"
            ? "Add details about your subscription"
            : "Update your subscription details"}
        </DialogDescription>
      </DialogHeader>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Netflix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Family streaming plan"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://netflix.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="9.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextBillingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Billing Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Add Subscription" : "Update Subscription"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}
    </DialogContent>
  );
}
