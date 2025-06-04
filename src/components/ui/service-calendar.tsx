import { useState, useMemo } from 'react';
import {
  Calendar as BigCalendar,
  dayjsLocalizer,
  View,
  ToolbarProps,
  Event,
} from 'react-big-calendar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ServiceSchedule } from '@/app/dashboard/services/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeftIcon, ChevronRightIcon, FilterIcon } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configure dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

interface ServiceCalendarProps {
  services: ServiceSchedule[];
  onEventClick?: (service: ServiceSchedule) => void;
}

interface ServiceEvent extends Event {
  resource: ServiceSchedule;
}

const CustomToolbar = (toolbar: ToolbarProps<ServiceEvent>) => {
  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  const goToPrevious = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={goToPrevious}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToNext}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold ml-2">{toolbar.label}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={toolbar.view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toolbar.onView('month')}
        >
          Month
        </Button>
        <Button
          variant={toolbar.view === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toolbar.onView('week')}
        >
          Week
        </Button>
        <Button
          variant={toolbar.view === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toolbar.onView('day')}
        >
          Day
        </Button>
        <Button
          variant={toolbar.view === 'agenda' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toolbar.onView('agenda')}
        >
          Agenda
        </Button>
      </div>
    </div>
  );
};

export function ServiceCalendar({
  services,
  onEventClick,
}: ServiceCalendarProps) {
  const [view, setView] = useState<View>('month');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const eventTypes = useMemo(() => {
    const types = new Set(services.map((service) => service.type));
    return Array.from(types);
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedTypes.length === 0) return services;
    return services.filter((service) => selectedTypes.includes(service.type));
  }, [services, selectedTypes]);

  const events = filteredServices.map((service) => ({
    id: service.id,
    title: `${service.type} - ${service.roomName}`,
    start: dayjs(service.nextDue).toDate(),
    end: dayjs(service.nextDue).add(1, 'hour').toDate(),
    resource: service,
  }));

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'CLEANING':
        return '🧹';
      case 'MAINTENANCE':
        return '🔧';
      case 'INSPECTION':
        return '🔍';
      case 'REPAIR':
        return '🔨';
      default:
        return '📅';
    }
  };

  const eventStyleGetter = (event: ServiceEvent) => {
    const service = event.resource;
    let backgroundColor = '#4CAF50';
    let borderColor = '#388E3C';

    switch (service.type) {
      case 'CLEANING':
        backgroundColor = '#2196F3';
        borderColor = '#1976D2';
        break;
      case 'MAINTENANCE':
        backgroundColor = '#FF9800';
        borderColor = '#F57C00';
        break;
      case 'INSPECTION':
        backgroundColor = '#9C27B0';
        borderColor = '#7B1FA2';
        break;
      case 'REPAIR':
        backgroundColor = '#F44336';
        borderColor = '#D32F2F';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '2px solid',
        display: 'block',
        padding: '2px 4px',
        fontSize: '0.875rem',
      },
    };
  };

  const formats = {
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
      return `${dayjs(start).format('h:mm A')} - ${dayjs(end).format(
        'h:mm A'
      )}`;
    },
    dayFormat: (date: Date) => dayjs(date).format('ddd D'),
    monthHeaderFormat: (date: Date) => dayjs(date).format('MMMM YYYY'),
    dayHeaderFormat: (date: Date) => dayjs(date).format('ddd D'),
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by type:</span>
        </div>
        {eventTypes.map((type) => (
          <Badge
            key={type}
            variant={selectedTypes.includes(type) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => {
              setSelectedTypes((prev) =>
                prev.includes(type)
                  ? prev.filter((t) => t !== type)
                  : [...prev, type]
              );
            }}
          >
            {getEventIcon(type)} {type}
          </Badge>
        ))}
      </div>
      <div className="h-[600px]">
        <BigCalendar<ServiceEvent>
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => onEventClick?.(event.resource)}
          popup
          selectable
          toolbar={true}
          components={{
            toolbar: CustomToolbar,
            event: ({ event }) => (
              <div className="flex items-center gap-1">
                <span>{getEventIcon(event.resource.type)}</span>
                <span className="truncate">{event.title}</span>
              </div>
            ),
          }}
          formats={formats}
          views={['month', 'week', 'day', 'agenda']}
          step={60}
          timeslots={1}
          min={dayjs().startOf('day').add(8, 'hour').toDate()}
          max={dayjs().startOf('day').add(20, 'hour').toDate()}
          tooltipAccessor={(event) =>
            `${event.title}\n${dayjs(event.start).format('MMM D, YYYY h:mm A')}`
          }
        />
      </div>
    </div>
  );
}
