
import React from 'react';
import { useState, useEffect } from 'react';
import { KpiData, AnomalyAlert } from '../../types';
import { getKpiData, getAnomalyAlerts } from '../../services/mockApi';
import KpiCard from '../../components/KpiCard';
import SalesChart from './components/SalesChart';
import LeadsBySourceChart from './components/LeadsBySourceChart';
import AnomalyAlerts from './components/AnomalyAlerts';
import { Skeleton } from '../../components/ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';

function DashboardPage(): React.ReactNode {
  const [kpis, setKpis] = useState<KpiData[] | null>(null);
  const [alerts, setAlerts] = useState<AnomalyAlert[] | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const fetchData = async () => {
      const kpiData = await getKpiData(t);
      const anomalyAlerts = await getAnomalyAlerts();
      setKpis(kpiData);
      setAlerts(anomalyAlerts);
    };
    fetchData();
  }, [t]);

  const handleAck = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts ? prevAlerts.map(a => a.id === id ? { ...a, acknowledged: true } : a) : null
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis ? (
          kpis.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)
        ) : (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[126px]" />)
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesChart />
        </div>
        <div className="lg:col-span-3">
          <LeadsBySourceChart />
        </div>
      </div>
      
      <div>
        {alerts ? (
          <AnomalyAlerts alerts={alerts} onAck={handleAck} />
        ) : (
          <Skeleton className="h-[200px]" />
        )}
      </div>
    </div>
  );
}

export default DashboardPage;