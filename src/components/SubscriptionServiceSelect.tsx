
import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';
import { connectToSubscriptionService } from '@/lib/serviceConnection';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

// Service types with their branding colors and advanced integration info
export const subscriptionServices = [
  { 
    id: 'netflix', 
    name: 'Netflix', 
    color: '#E50914', 
    url: 'https://www.netflix.com/login',
    apiIntegration: true, 
    features: ['View subscription details', 'Manage payment method', 'Update plan', 'Cancel subscription']
  },
  { 
    id: 'spotify', 
    name: 'Spotify', 
    color: '#1ED760', 
    url: 'https://accounts.spotify.com/login',
    apiIntegration: true,
    features: ['View subscription details', 'Change plan', 'Cancel subscription']
  },
  { 
    id: 'disney', 
    name: 'Disney+', 
    color: '#0063e5', 
    url: 'https://www.disneyplus.com/login',
    apiIntegration: true,
    features: ['View subscription details', 'Change plan', 'Cancel subscription']
  },
  { 
    id: 'hulu', 
    name: 'Hulu', 
    color: '#3DBB3D', 
    url: 'https://auth.hulu.com/web/login',
    apiIntegration: true,
    features: ['View subscription details', 'Change plan', 'Cancel subscription']
  },
  { 
    id: 'amazon', 
    name: 'Amazon Prime', 
    color: '#00A8E1', 
    url: 'https://www.amazon.com/ap/signin',
    apiIntegration: true,
    features: ['View subscription details', 'Manage payment method']
  },
  { 
    id: 'youtube', 
    name: 'YouTube Premium', 
    color: '#FF0000', 
    url: 'https://accounts.google.com/signin',
    apiIntegration: true,
    features: ['View subscription details', 'Change plan', 'Cancel subscription']
  },
  { 
    id: 'appletv', 
    name: 'Apple TV+', 
    color: '#000000', 
    url: 'https://tv.apple.com/signin',
    apiIntegration: true,
    features: ['View subscription details', 'Cancel subscription']
  },
  { 
    id: 'hbomax', 
    name: 'HBO Max', 
    color: '#5822b4', 
    url: 'https://www.hbomax.com/signin',
    apiIntegration: true,
    features: ['View subscription details', 'Change plan', 'Cancel subscription']
  },
  { 
    id: 'other', 
    name: 'Other Service', 
    color: '#666666', 
    url: '',
    apiIntegration: false,
    features: []
  }
];

type ServiceSelectProps = {
  onSelect: (service: typeof subscriptionServices[0]) => void;
  onConnectService: (service: typeof subscriptionServices[0]) => void;
  onServiceDetailsReceived?: (serviceDetails: any) => void;
};

export const SubscriptionServiceSelect = ({ 
  onSelect, 
  onConnectService,
  onServiceDetailsReceived
}: ServiceSelectProps) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setConnected(false);
    const service = subscriptionServices.find(s => s.id === serviceId);
    if (service) {
      onSelect(service);
    }
  };
  
  const handleConnectClick = async () => {
    if (!selectedService) {
      toast.error('Please select a subscription service first');
      return;
    }
    
    const service = subscriptionServices.find(s => s.id === selectedService);
    if (service) {
      setConnecting(true);
      
      try {
        // Connect to service and retrieve subscription details
        onConnectService(service);
        
        // Simulate service connection with our mock function
        const serviceDetails = await connectToSubscriptionService(service.id);
        
        if (serviceDetails) {
          // Pass service details to parent component
          if (onServiceDetailsReceived) {
            onServiceDetailsReceived(serviceDetails);
          }
          setConnected(true);
          toast.success(`Successfully connected to ${service.name}`);
        } else if (service.id === 'other') {
          // For "other" service, we'll let the user enter details manually
          toast.info('Please enter your subscription details manually');
        } else {
          toast.error(`Could not retrieve subscription details from ${service.name}`);
        }
      } catch (error) {
        console.error('Error connecting to service:', error);
        toast.error('Failed to connect to service');
      } finally {
        setConnecting(false);
      }
    }
  };
  
  const getSelectedService = () => {
    return subscriptionServices.find(s => s.id === selectedService);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Choose a subscription service</h3>
        <Select onValueChange={handleServiceSelect} value={selectedService || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a subscription service" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Entertainment</SelectLabel>
              {subscriptionServices
                .filter(s => ['netflix', 'disney', 'hulu', 'appletv', 'hbomax', 'youtube'].includes(s.id))
                .map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: service.color }}
                      ></span>
                      {service.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Music</SelectLabel>
              {subscriptionServices
                .filter(s => ['spotify'].includes(s.id))
                .map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: service.color }}
                      ></span>
                      {service.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Shopping</SelectLabel>
              {subscriptionServices
                .filter(s => ['amazon'].includes(s.id))
                .map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: service.color }}
                      ></span>
                      {service.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Other</SelectLabel>
              {subscriptionServices
                .filter(s => ['other'].includes(s.id))
                .map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {selectedService && (
        <Card className="overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getSelectedService()?.color }}
                >
                  {connected && <Check className="h-4 w-4 text-white" />}
                </div>
                <span className="font-medium text-lg">{getSelectedService()?.name}</span>
              </div>
              <div>
                {connected ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setConnected(false)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reconnect
                  </Button>
                ) : null}
              </div>
            </div>
            
            {getSelectedService()?.apiIntegration && (
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">This service supports direct integration:</p>
                <ul className="list-disc ml-5 space-y-1">
                  {getSelectedService()?.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {connected ? (
              <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md mt-2">
                <p className="text-green-800 dark:text-green-400 text-sm font-medium flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Connected successfully
                </p>
                <p className="text-green-700 dark:text-green-500 text-xs mt-1">
                  Your subscription details have been imported
                </p>
              </div>
            ) : (
              <Button 
                onClick={handleConnectClick}
                className="w-full flex items-center gap-2"
                disabled={connecting}
              >
                {connecting ? (
                  <>Connecting <RotateCcw className="h-4 w-4 ml-1 animate-spin" /></>
                ) : (
                  <>Connect Account <ExternalLink className="h-4 w-4" /></>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
