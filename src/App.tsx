/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import TaskProgress from './components/TaskProgress';
import TaskResults from './components/TaskResults';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'step1' | 'step2' | 'progress' | 'results'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {currentView === 'dashboard' && (
        <Dashboard onStartTask={() => setCurrentView('step1')} onViewResults={() => setCurrentView('results')} />
      )}
      {currentView === 'step1' && (
        <Step1 onBack={() => setCurrentView('dashboard')} onNext={() => setCurrentView('step2')} />
      )}
      {currentView === 'step2' && (
        <Step2 onBack={() => setCurrentView('step1')} onSubmit={() => setCurrentView('progress')} />
      )}
      {currentView === 'progress' && (
        <TaskProgress onBack={() => setCurrentView('dashboard')} onComplete={() => setCurrentView('results')} />
      )}
      {currentView === 'results' && (
        <TaskResults onBack={() => setCurrentView('dashboard')} />
      )}
    </div>
  );
}
