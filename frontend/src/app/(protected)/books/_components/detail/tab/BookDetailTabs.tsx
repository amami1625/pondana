'use client';

import { useState } from 'react';
import ListItem from './ListItem';
import TabButton from './TabButton';
import type { BookDetail } from '@/app/(protected)/books/_types';

interface BookDetailTabsProps {
  lists: BookDetail['lists'];
  cards: BookDetail['cards'];
}

export default function BookDetailTabs({ lists, cards }: BookDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'lists' | 'cards'>('lists');

  return (
    <div className="flex flex-col">
      {/* タブヘッダー */}
      <div className="border-b border-slate-200">
        <nav aria-label="Tabs" className="-mb-px flex gap-6">
          <TabButton isActive={activeTab === 'lists'} onClick={() => setActiveTab('lists')}>
            この本が追加されているリスト
          </TabButton>
          <TabButton isActive={activeTab === 'cards'} onClick={() => setActiveTab('cards')}>
            作成されたカード
          </TabButton>
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="py-6">
        {activeTab === 'lists' && <ListItem items={lists} variant="list" />}
        {activeTab === 'cards' && <ListItem items={cards} variant="card" />}
      </div>
    </div>
  );
}
