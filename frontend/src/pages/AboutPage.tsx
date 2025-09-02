import React from 'react';
import { Brain, Users, Award, Target, BookOpen, Lightbulb, Heart, Shield } from 'lucide-react';

const AboutPage: React.FC = () => {
  const researchHighlights = [
    {
      title: 'Speech Pattern Recognition',
      description: 'Advanced algorithms analyze over 50 speech features including pause patterns, semantic fluency, and vocabulary complexity.',
      icon: Brain,
    },
    {
      title: 'Clinical Validation',
      description: 'Our models are trained on datasets from leading medical institutions with 85%+ accuracy in early detection.',
      icon: Award,
    },
    {
      title: 'Longitudinal Studies',
      description: 'Research spanning 5+ years tracking speech changes in both healthy individuals and those with cognitive decline.',
      icon: BookOpen,
    },
    {
      title: 'Multi-language Support',
      description: 'Analysis capabilities across multiple languages, accounting for linguistic and cultural variations.',
      icon: Users,
    },
  ];

  const timeline = [
    {
      year: '2019',
      title: 'Research Foundation',
      description: 'Initial research collaboration with leading neurology departments to study speech-cognition relationships.',
    },
    {
      year: '2020',
      title: 'AI Development',
      description: 'Development of proprietary machine learning algorithms for speech pattern analysis.',
    },
    {
      year: '2021',
      title: 'Clinical Trials',
      description: 'Extensive clinical validation with over 10,000 participants across multiple medical centers.',
    },
    {
      year: '2022',
      title: 'Platform Launch',
      description: 'Beta launch of CogniVoice platform with select healthcare partners.',
    },
    {
      year: '2023',
      title: 'Public Release',
      description: 'Full public release with enhanced privacy features and improved accuracy.',
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'International expansion and partnerships with healthcare systems worldwide.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FFEAD8] via-white to-[#E8988A]/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-[#2A1458] mb-6">
              About Alzheimer's Disease & Our Mission
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Understanding the disease that affects millions worldwide and how innovative 
              technology can help with early detection and better outcomes.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#FFEAD8]">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Brain className="w-12 h-12 text-[#9B177E]" />
                <Heart className="w-12 h-12 text-[#E8988A]" />
                <Shield className="w-12 h-12 text-[#2A1458]" />
              </div>
              <p className="text-[#2A1458] font-semibold text-lg">
                Combining cutting-edge AI with compassionate care for better cognitive health outcomes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alzheimer's Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2A1458] mb-6">
                Understanding Alzheimer's Disease
              </h2>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#2A1458] mb-3">What is Alzheimer's?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Alzheimer's disease is a progressive brain disorder that slowly destroys memory and thinking skills. 
                    It's the most common cause of dementia among older adults, affecting over 55 million people worldwide.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-[#E8988A]/20 to-[#9B177E]/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#2A1458] mb-3">The Progression</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The disease progresses through several stages, from mild cognitive impairment to severe dementia. 
                    Early detection is crucial as it allows for better planning and potentially slowing progression.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-[#9B177E]/20 to-[#2A1458]/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#2A1458] mb-3">Current Challenges</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Traditional diagnosis often occurs when symptoms are already advanced. 
                    Our goal is to detect changes years earlier through innovative speech analysis.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <img 
                src="/disease.jpg" 
                alt="Healthcare professional with patient"
                className="rounded-2xl shadow-xl w-full h-64 object-cover"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FFEAD8] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#2A1458]">55M+</div>
                  <div className="text-sm text-gray-600">People Affected</div>
                </div>
                <div className="bg-[#E8988A]/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#2A1458]">10M+</div>
                  <div className="text-sm text-gray-600">New Cases/Year</div>
                </div>
                <div className="bg-[#9B177E]/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#2A1458]">$1.1T</div>
                  <div className="text-sm text-gray-600">Global Cost</div>
                </div>
                <div className="bg-[#2A1458]/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">3-5 yrs</div>
                  <div className="text-sm text-white/80">Earlier Detection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Highlights */}
      <section className="py-16 bg-gradient-to-r from-[#FFEAD8]/50 to-[#E8988A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A1458] mb-4">
              Our Research & Technology
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Years of research and development have led to breakthrough technology that can 
              detect cognitive changes through speech analysis with unprecedented accuracy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {researchHighlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full p-3 flex-shrink-0">
                    <highlight.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2A1458] mb-3">{highlight.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{highlight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A1458] mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From initial research to global platform, here's how we've evolved to become 
              a leader in AI-powered cognitive health screening.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#9B177E] to-[#2A1458] rounded-full"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#FFEAD8]">
                      <div className="text-2xl font-bold text-[#9B177E] mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-[#2A1458] mb-3">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-white border-4 border-[#9B177E] rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gradient-to-r from-[#9B177E] to-[#2A1458]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12">
            <Lightbulb className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              To democratize early cognitive health screening through innovative AI technology, 
              making it accessible, affordable, and accurate for everyone. We believe that early 
              detection can transform lives and give families more time to plan, prepare, and 
              make the most of every moment together.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Target className="w-8 h-8 text-white mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">Accuracy</h4>
                <p className="text-white/80 text-sm">85%+ detection accuracy</p>
              </div>
              <div>
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">Accessibility</h4>
                <p className="text-white/80 text-sm">Available to everyone</p>
              </div>
              <div>
                <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">Privacy</h4>
                <p className="text-white/80 text-sm">Your data is secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;