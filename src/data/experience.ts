export type Experience = {
  company: string
  year: string
  title: string
  // The one line a visitor should take away from this entry
  highlight: string
  description: string
  tags: string[]
  link?: string
}

// Newest first
export const experience: Experience[] = [
  {
    company: 'BrowserStack',
    year: '2022 – present',
    title: 'Pricing & Growth Platform',
    highlight: 'Higher purchase conversion',
    description:
      'Improved PSI metrics for the pricing page, boosting purchase conversion. Engineered revenue growth initiatives through scalable pricing components. Streamlined the product release pipeline and enhanced Pro feature workflows.',
    tags: ['React', 'Ruby on Rails', 'Node.js', 'Karpenter', 'AWS'],
  },
  {
    company: 'Wingify · VWO',
    year: '2019 – 2022',
    title: 'VWO Core Platform',
    highlight: '96% less main-thread blocking',
    description:
      "Built the industry's 1st A/B testing capability inside Shadow DOM. Reduced customer issues by 80%. Redesigned the event-driven JS library architecture, cutting main-thread blocking by 96%. Improved Core JS library performance by 50%.",
    tags: ['JavaScript', 'TypeScript', 'Event-driven', 'Web Vitals'],
  },
  {
    company: 'Xane AI',
    year: '2018 – 2019',
    title: 'Xane HR & CX Platform',
    highlight: 'Deep-learning chatbot services',
    description:
      'Developed AI-centric HR & CX products including Analytics Dashboards and Conversational Bot UIs. Built microservices for deep learning chatbot models and designed the full-stack product architecture.',
    tags: ['Python', 'React', 'Keras', 'TensorFlow', 'NLP'],
  },
  {
    company: 'Personal',
    year: '2015 – present',
    title: 'Open Source & Side Projects',
    highlight: 'Open source since 2015',
    description:
      'Exploring Rust systems programming, distributed systems, and cloud-native tooling. Passionate about algorithms, data structures, and developer experience — actively contributing to open source since 2015.',
    tags: ['Rust', 'Node.js', 'TypeScript', 'Docker', 'AWS'],
    link: 'https://github.com/AbhimanyuVashisht',
  },
]
