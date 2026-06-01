'use client';

import { useState } from 'react';
import mockActivities from '../mockData.json';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  // Enkle utregninger basert på mock-dataene
  const totalMeters = mockActivities.reduce((acc, act) => acc + act.distance_meters, 0);
  const totalKm = (totalMeters / 1000).toFixed(1);
  const totalWorkouts = mockActivities.length;

  // Hjelpefunksjon for å gjøre sekunder om til minutter/sekunder-tempo
  const calculateAveragePace = () => {
    const totalSeconds = mockActivities.reduce((acc, act) => acc + act.moving_time_secs, 0);
    const totalKmNum = totalMeters / 1000;
    const paceSecondsPerKm = totalSeconds / totalKmNum;
    const minutes = Math.floor(paceSecondsPerKm / 60);
    const seconds = Math.floor(paceSecondsPerKm % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min/km`;
  };

  // HVIS DEMO ER AKTIV: Vis et enkelt dashboard
  if (showDemo) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-orange-500">🏃‍♂️ MinLøpeData // DEMO</h1>
            <button 
              onClick={() => setShowDemo(false)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              Tilbake til forsiden
            </button>
          </div>

          {/* KPI BOKSER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <p className="text-sm text-slate-400 font-medium">Distanse (mai)</p>
              <p className="text-3xl font-bold mt-1 text-white">{totalKm} km</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <p className="text-sm text-slate-400 font-medium">Antall økter</p>
              <p className="text-3xl font-bold mt-1 text-white">{totalWorkouts}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <p className="text-sm text-slate-400 font-medium">Snittfart</p>
              <p className="text-3xl font-bold mt-1 text-white">{calculateAveragePace()}</p>
            </div>
          </div>

          {/* LISTE OVER ØKTER */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Siste aktiviteter</h2>
            <div className="space-y-3">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                  <div>
                    <p className="font-semibold text-slate-200">{activity.name}</p>
                    <p className="text-xs text-slate-500">{new Date(activity.start_date).toLocaleDateString('no-NO')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-400">{(activity.distance_meters / 1000).toFixed(2)} km</p>
                    <p className="text-xs text-slate-400">{Math.floor(activity.moving_time_secs / 60)} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // LANDING PAGE (Standard visning)
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-3 bg-orange-500/10 rounded-2xl text-orange-500 text-3xl mb-2">
          🏃‍♂️
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
          Uoffisielt Strava Dashboard
        </h1>
        <p className="text-base text-slate-400">
          Få dypere innsikt i pulssonene dine, treningsfrekvens og progresjon over tid. Helt uten abonnementsavgifter.
        </p>
        
        <div className="pt-4 space-y-3">
          <button 
            disabled 
            className="w-full bg-orange-600 opacity-50 cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-orange-600/20"
          >
            Koble til Strava (Kommer snart)
          </button>
          
          <button 
            onClick={() => setShowDemo(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl border border-slate-700 transition"
          >
            Se Demomodus
          </button>
        </div>
      </div>
    </main>
  );
}
