import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Shield, 
  Mic, 
  BarChart3, 
  Clock, 
  Heart,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';

const HomePage: React.FC = () => {
  const statistics = [
    { number: '55M+', label: 'People with dementia worldwide', icon: Users },
    { number: '10M+', label: 'New cases every year', icon: TrendingUp },
    { number: '85%', label: 'Early detection accuracy', icon: BarChart3 },
    { number: '3-5 years', label: 'Earlier detection possible', icon: Clock },
  ];

  const features = [
    {
      icon: Mic,
      title: 'Voice Analysis',
      description: 'Advanced AI analyzes speech patterns, pauses, and linguistic complexity to identify early cognitive changes.',
    },
    {
      icon: Brain,
      title: 'Cognitive Assessment',
      description: 'Comprehensive evaluation using the Cookie Theft Picture test and other validated neuropsychological methods.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. We prioritize your privacy while providing accurate analysis.',
    },
    {
      icon: Activity,
      title: 'Real-time Results',
      description: 'Get instant feedback and detailed reports with actionable insights and recommendations.',
    },
  ];

  const speechIndicators = [
    'Increased pause frequency and duration',
    'Reduced vocabulary complexity',
    'Semantic fluency difficulties',
    'Changes in speech rate and rhythm',
    'Word-finding difficulties',
    'Reduced grammatical complexity',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FFEAD8] via-white to-[#E8988A]/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-[#2A1458] leading-tight">
                  Early Detection Through
                  <span className="text-[#9B177E] block">Voice Analysis</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Harness the power of AI to detect early signs of Alzheimer's disease through 
                  advanced speech pattern analysis. Early detection can make all the difference.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Start Analysis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-[#9B177E] text-[#9B177E] px-8 py-4 rounded-full font-semibold hover:bg-[#9B177E] hover:text-white transition-all duration-300 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-[#E8988A]/20 to-[#9B177E]/20 rounded-3xl p-8">
                <img 
                  src="/senior-people-confronting-alzheimer-disease.jpg" 
                  alt="Healthcare professional with elderly patient"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-[#FFEAD8]">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#9B177E] rounded-full p-2">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2A1458]">85% Accuracy</p>
                    <p className="text-sm text-gray-600">Early Detection Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A1458] mb-4">
              The Global Impact of Alzheimer's Disease
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understanding the scale of Alzheimer's disease helps us appreciate the importance of early detection and intervention.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/30 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="bg-[#9B177E] rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-[#2A1458] transition-colors duration-300">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-[#2A1458] mb-2">{stat.number}</div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Alzheimer's Section */}
      <section className="py-16 bg-gradient-to-r from-[#FFEAD8]/50 to-[#E8988A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/disease.jpg" 
                alt="Brain scan showing Alzheimer's progression"
                className="rounded-2xl shadow-xl w-full h-96 object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#2A1458] mb-4">
                  Understanding Alzheimer's Disease
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Alzheimer's disease is a progressive neurodegenerative disorder that affects memory, 
                  thinking, and behavior. It's the most common cause of dementia, accounting for 60-80% of cases.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-[#E8988A] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#2A1458] mb-1">Early Symptoms</h4>
                    <p className="text-gray-600 text-sm">Memory loss, confusion, difficulty with familiar tasks, and changes in mood or personality.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-[#9B177E] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#2A1458] mb-1">Brain Changes</h4>
                    <p className="text-gray-600 text-sm">Abnormal protein deposits (plaques and tangles) damage and kill brain cells.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-[#E8988A] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#2A1458] mb-1">Impact on Families</h4>
                    <p className="text-gray-600 text-sm">Affects not just patients but their families and caregivers, requiring comprehensive support systems.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speech Analysis Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A1458] mb-4">
              Speech as an Early Indicator
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Recent research shows that changes in speech patterns can be detected years before 
              traditional cognitive tests reveal symptoms. Our AI analyzes these subtle changes.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-[#2A1458] mb-6">
                Key Speech Indicators We Analyze:
              </h3>
              
              <div className="space-y-3">
                {speechIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#9B177E] flex-shrink-0" />
                    <span className="text-gray-700">{indicator}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/20 rounded-xl p-6 border-l-4 border-[#9B177E]">
                <h4 className="font-semibold text-[#2A1458] mb-2">Why Speech Analysis?</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Speech production involves multiple cognitive processes including memory, attention, 
                  and executive function. Changes in these areas can be detected through careful analysis 
                  of speech patterns, often before other symptoms appear.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-[#9B177E]/10 to-[#2A1458]/10 rounded-3xl p-8">
                <img 
                  src="/speech.jpg" 
                  alt="waveform of speech analysis"
                  className="rounded-2xl shadow-xl w-full h-80 object-cover"
                />
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-[#FFEAD8]">
                <div className="flex items-center space-x-2">
                  <Mic className="w-5 h-5 text-[#9B177E]" />
                  <span className="text-sm font-medium text-[#2A1458]">AI Listening</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-[#E8988A]/10 to-[#9B177E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A1458] mb-4">
              How Our Technology Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our advanced AI system combines multiple analysis techniques to provide accurate, 
              reliable results while maintaining the highest standards of privacy and security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full p-4 w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#2A1458] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#9B177E] to-[#2A1458]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Analysis?
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Join thousands of users who trust CogniVoice for early cognitive health screening. 
            Take the first step towards proactive health management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-[#9B177E] px-8 py-4 rounded-full font-semibold hover:bg-[#FFEAD8] transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#9B177E] transition-all duration-300 text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;