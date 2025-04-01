
import React from 'react';
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
import { ArrowRight, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

// Service types with their branding colors
export const subscriptionServices = [
  { id: 'netflix', name: 'Netflix', color: '#E50914', url: 'https://www.netflix.com/login' },
  { id: 'spotify', name: 'Spotify', color: '#1ED760', url: 'https://accounts.spotify.com/login' },
  { id: 'disney', name: 'Disney+', color: '#0063e5', url: 'https://www.disneyplus.com/login' },
  { id: 'hulu', name: 'Hulu', color: '#3DBB3D', url: 'https://auth.hulu.com/web/login' },
  { id: 'amazon', name: 'Amazon Prime', color: '#00A8E1', url: 'https://www.amazon.com/ap/signin' },
  { id: 'youtube', name: 'YouTube Premium', color: '#FF0000', url: 'https://accounts.google.com/signin' },
  { id: 'appletv', name: 'Apple TV+', color: '#000000', url: 'https://tv.apple.com/signin' },
  { id: 'hbomax', name: 'HBO Max', color: '#5822b4', url: 'https://www.hbomax.com/signin' },
  { id: 'other', name: 'Other Service', color: '#666666', url: '' }
];

type ServiceSelectProps = {
  onSelect: (service: typeof subscriptionServices[0]) => void;
  onConnectService: (service: typeof subscriptionServices[0]) => void;
};

export const SubscriptionServiceSelect = ({ onSelect, onConnectService }: ServiceSelectProps) => {
  const [selectedService, setSelectedService] = React.useState<string | null>(null);
  
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = subscriptionServices.find(s => s.id === serviceId);
    if (service) {
      onSelect(service);
    }
  };
  
  const handleConnectClick = () => {
    if (!selectedService) {
      toast.error('Please select a subscription service first');
      return;
    }
    
    const service = subscriptionServices.find(s => s.id === selectedService);
    if (service) {
      onConnectService(service);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Choose a subscription service</h3>
        <Select onValueChange={handleServiceSelect}>
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
        <div className="p-4 border rounded-md bg-muted/50">
          <p className="mb-2">Connect to your subscription account to:</p>
          <ul className="list-disc ml-5 mb-4 text-sm text-muted-foreground">
            <li>Automatically import subscription details</li>
            <li>Manage your subscription (renew, edit, cancel)</li>
            <li>Get accurate billing information</li>
          </ul>
          <Button 
            onClick={handleConnectClick}
            className="w-full flex items-center gap-2"
          >
            Connect Account <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
