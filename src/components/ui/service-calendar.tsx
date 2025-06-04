import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { ServiceSchedule } from '@/app/dashboard/services/types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface ServiceCalendarProps {
  services: ServiceSchedule[];
  onEventClick?: (service: ServiceSchedule) => void;
}

export function ServiceCalendar({
  services,
  onEventClick,
}: ServiceCalendarProps) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const events = services.map((service) => ({
    id: service.id,
    title: `${service.type} - ${service.roomName}`,
    start: new Date(service.nextDue),
    end: new Date(service.nextDue),
    resource: service,
  }));

  const eventStyleGetter = (event: any) => {
    const service = event.resource as ServiceSchedule;
    let backgroundColor = '#4CAF50'; // Default green

    switch (service.type) {
      case 'CLEANING':
        backgroundColor = '#2196F3'; // Blue
        break;
      case 'MAINTENANCE':
        backgroundColor = '#FF9800'; // Orange
        break;
      case 'INSPECTION':
        backgroundColor = '#9C27B0'; // Purple
        break;
      case 'REPAIR':
        backgroundColor = '#F44336'; // Red
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block',
      },
    };
  };

  return (
    <div className="h-[600px]">
      <BigCalendar
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
      />
    </div>
  );
}
