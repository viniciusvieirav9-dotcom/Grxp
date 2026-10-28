/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext.tsx';
import { ThemeProvider } from './ThemeContext.tsx';
import { Transaction, Goal, Challenge } from './types.ts';

// Components
import { Navbar } from './Navbar.tsx';
import { LandingHero } from './LandingHero.tsx';
import { LandingFeatures } from './LandingFeatures.tsx';
import { PublicSimulator } from './PublicSimulator.tsx';
import { InvestmentGuide } from './InvestmentGuide.tsx';
import { InvestmentQuizModal } from './InvestmentQuizModal.tsx';
import { AuthModal } from './AuthModal.tsx';
import { DashboardOverview } from './DashboardOverview.tsx';
import { TransactionList } from './TransactionList.tsx';
import { TransactionModal } from './TransactionModal.tsx';
import { GoalsSection } from './GoalsSection.tsx';
import { GoalModal } from './GoalModal.tsx';
import { ChallengesSection } from './ChallengesSection.tsx';
import { ShareAchievementModal } from './ShareAchievementModal.tsx';
import { WeeklyReportModal } from './WeeklyReportModal.tsx';
import { ProfileModal } from './ProfileModal.tsx';
import { AdminModal } from './AdminModal.tsx';
import { PrivacyModal } from './PrivacyModal.tsx';
import { Footer } from './Footer.tsx';

function MainApp() {
  const { user, token, refreshUser, celebrate } = useAuth();

  // Navigation tab for logged-in user
  const [currentTab, setCurrentTab] = useState<
    'overview' | 'transactions' | 'goals' | 'challenges' | 'investments'
  >('overview');

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Modals state
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [transactionModal, setTransactionModal] = useState<{
    isOpen: boolean;
    tx: Transaction | null;
  }>({
    isOpen: false,
    tx: null,
  });
  const [goalModal, setGoalModal] = useState<{ isOpen: boolean; goal: Goal | null }>({
    isOpen: false,
    goal: null,
  });
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [weeklyReportModalOpen, setWeeklyReportModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Fetch logged user data
  useEffect(() => {
    if (!token) {
      setTransactions([]);
      setGoals([]);
      return;
    }

    // Transactions
    fetch('/api/transactions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTransactions(data);
      })
      .catch((err) => console.warn('Erro ao carregar movimentações:', err));

    // Goals
    fetch('/api/goals', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGoals(data);
      })
      .catch((err) => console.warn('Erro ao carregar metas:', err));
  }, [token]);

  // Fetch challenges
  const fetchChallenges = () => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/challenges', { headers })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setChallenges(data);
      })
      .catch((err) => console.warn('Erro ao carregar desafios:', err));
  };

  useEffect(() => {
    fetchChallenges();
  }, [token, user?.xp]);

  // Handlers for Transactions
  const handleSaveTransaction = async (txData: any) => {
    if (!token) return;

    if (transactionModal.tx) {
      // Edit
      const res = await fetch(`/api/transactions/${transactionModal.tx.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(txData),
      });
      if (res.ok) {
        const updated = await res.json();
        setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
    } else {
      // Create
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(txData),
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions((prev) => [data.transaction, ...prev]);
        celebrate();
        refreshUser();
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!token) return;
    const res = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Handlers for Goals
  const handleSaveGoal = async (goalData: any) => {
    if (!token) return;

    if (goalModal.goal) {
      // Edit
      const res = await fetch(`/api/goals/${goalModal.goal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      });
      if (res.ok) {
        const updated = await res.json();
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      }
    } else {
      // Create
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      });
      if (res.ok) {
        const data = await res.json();
        setGoals((prev) => [data.goal, ...prev]);
        celebrate();
        refreshUser();
      }
    }
  };

  const handleDepositGoal = async (goalId: string, amount: number) => {
    if (!token) return;
    const res = await fetch(`/api/goals/${goalId}/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (res.ok) {
      const data = await res.json();
      setGoals((prev) => prev.map((g) => (g.id === goalId ? data.goal : g)));
      celebrate();
      refreshUser();
    }
  };

  const handleToggleGoalStatus = async (
    goalId: string,
    status: 'active' | 'paused' | 'completed'
  ) => {
    if (!token) return;
    const res = await fetch(`/api/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const updated = await res.json();
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!token) return;
    const res = await fetch(`/api/goals/${goalId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    }
  };

  const handleClaimChallenge = async (challengeId: string) => {
    if (!token) return;
    const res = await fetch(`/api/challenges/${challengeId}/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      celebrate();
      refreshUser();
      fetchChallenges();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-emerald-400 selection:text-neutral-950">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenSimulator={() => scrollToSection('simulador')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {user ? (
          /* Authenticated User Workspace */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentTab === 'overview' && (
              <DashboardOverview
                transactions={transactions}
                goals={goals}
                onOpenAddTransaction={() => setTransactionModal({ isOpen: true, tx: null })}
                onOpenAddGoal={() => setGoalModal({ isOpen: true, goal: null })}
                onOpenShareModal={() => setShareModalOpen(true)}
                onOpenWeeklyReport={() => setWeeklyReportModalOpen(true)}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'transactions' && (
              <TransactionList
                transactions={transactions}
                onOpenAddModal={() => setTransactionModal({ isOpen: true, tx: null })}
                onEditTransaction={(tx) => setTransactionModal({ isOpen: true, tx })}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {currentTab === 'goals' && (
              <GoalsSection
                goals={goals}
                onOpenCreateGoal={() => setGoalModal({ isOpen: true, goal: null })}
                onEditGoal={(goal) => setGoalModal({ isOpen: true, goal })}
                onDepositGoal={handleDepositGoal}
                onToggleGoalStatus={handleToggleGoalStatus}
                onDeleteGoal={handleDeleteGoal}
              />
            )}

            {currentTab === 'challenges' && (
              <ChallengesSection
                challenges={challenges}
                onClaimReward={handleClaimChallenge}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'investments' && (
              <div className="space-y-12">
                <InvestmentGuide onOpenQuiz={() => setQuizModalOpen(true)} />
                <PublicSimulator />
              </div>
            )}
          </div>
        ) : (
          /* Public Visitor Experience */
          <div>
            <LandingHero
              onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
              onScrollToSimulator={() => scrollToSection('simulador')}
              onScrollToInvestments={() => scrollToSection('investments')}
            />

            <LandingFeatures />

            <PublicSimulator onOpenAuth={() => setAuthModal({ isOpen: true, mode: 'register' })} />

            <InvestmentGuide onOpenQuiz={() => setQuizModalOpen(true)} />
          </div>
        )}
      </main>

      {/* Footer with discreet admin gear */}
      <Footer
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />

      <TransactionModal
        isOpen={transactionModal.isOpen}
        transactionToEdit={transactionModal.tx}
        onClose={() => setTransactionModal({ isOpen: false, tx: null })}
        onSave={handleSaveTransaction}
      />

      <GoalModal
        isOpen={goalModal.isOpen}
        goalToEdit={goalModal.goal}
        onClose={() => setGoalModal({ isOpen: false, goal: null })}
        onSave={handleSaveGoal}
      />

      <InvestmentQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
      />

      <ShareAchievementModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <WeeklyReportModal
        isOpen={weeklyReportModalOpen}
        transactions={transactions}
        goals={goals}
        onClose={() => setWeeklyReportModalOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
