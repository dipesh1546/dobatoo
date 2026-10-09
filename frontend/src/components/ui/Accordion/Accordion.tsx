import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={`dobato-accordion ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className={`dobato-accordion-item ${isOpen ? 'dobato-accordion-item-open' : ''}`}
          >
            <button
              className="dobato-accordion-header"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-header-${item.id}`}
            >
              <span>{item.question}</span>
              <span className={`dobato-accordion-icon ${isOpen ? 'dobato-accordion-icon-open' : ''}`}>
                <ChevronDown size={20} />
              </span>
            </button>

            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`accordion-header-${item.id}`}
                className="dobato-accordion-content"
              >
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
