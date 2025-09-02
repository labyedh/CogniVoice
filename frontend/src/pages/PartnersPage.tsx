import React, { useState, useEffect } from 'react';
import { 
  Building2, Award, Users, Globe, Heart, Stethoscope, 
  GraduationCap, Microscope, Loader2 
} from 'lucide-react';
import { getPublicPartners } from '../api/public'; // Import our new API function
import { Partner } from '../types/admin'; // Reuse the Partner type definition

// Helper function to map the partner 'type' string from the API to a Lucide icon component
const getPartnerIcon = (type: string) => {
  switch (type) {
    case 'Medical Institution':
    case 'Healthcare System':
      return Stethoscope;
    case 'Research Institution':
      return GraduationCap;
    case 'Non-Profit Organization':
      return Users;
    case 'Technology Partner':
      return Microscope;
    case 'International Organization':
      return Globe;
    default:
      return Building2; // A generic default icon
  }
};

const PartnersPage: React.FC = () => {
  // --- STATE MANAGEMENT for dynamic data ---
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING when the component mounts ---
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        // Fetch only active partners from the public endpoint
        const data = await getPublicPartners();
        setPartners(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load partners.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartners();
  }, []); // The empty dependency array means this runs only once on mount

  // This data can remain static as it's part of the page's design
  const collaborationAreas = [
    {
      title: 'Clinical Research',
      description: 'Collaborative studies with leading medical institutions to validate and improve our technology.',
      icon: Stethoscope,
      partners: 15,
    },
    {
      title: 'Technology Development',
      description: 'Partnerships with top universities and tech companies for AI and machine learning advancement.',
      icon: Microscope,
      partners: 8,
    },
    {
      title: 'Healthcare Integration',
      description: 'Working with healthcare systems to integrate our solutions into clinical workflows.',
      icon: Building2,
      partners: 25,
    },
    {
      title: 'Community Outreach',
      description: 'Collaborating with non-profits and advocacy groups to increase awareness and accessibility.',
      icon: Heart,
      partners: 12,
    },
  ];

    
    
      return (
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-[#FFEAD8] via-white to-[#E8988A]/20 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-[#2A1458] mb-6">
                  Our Partners & Collaborators
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  Working together with leading institutions, healthcare systems, and research organizations 
                  to advance cognitive health screening and make early detection accessible worldwide.
                </p>
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#9B177E]">60+</div>
                    <div className="text-gray-600">Active Partners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#9B177E]">25+</div>
                    <div className="text-gray-600">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#9B177E]">100K+</div>
                    <div className="text-gray-600">Patients Served</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    
          {/* Collaboration Areas */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#2A1458] mb-4">
                  Areas of Collaboration
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our partnerships span multiple domains, from cutting-edge research to real-world 
                  implementation and community impact.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {collaborationAreas.map((area, index) => (
                  <div key={index} className="bg-gradient-to-br from-[#FFEAD8] to-[#E8988A]/20 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
                    <div className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <area.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2A1458] mb-3">{area.title}</h3>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{area.description}</p>
                    <div className="text-2xl font-bold text-[#9B177E]">{area.partners}</div>
                    <div className="text-xs text-gray-600">Active Partners</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

      {/* --- FEATURED PARTNERS SECTION (NOW DYNAMIC) --- */}
      <section className="py-16 bg-gradient-to-r from-[#FFEAD8]/50 to-[#E8988A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A1458] mb-4">
              Featured Partners
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet some of our key partners who are helping us revolutionize cognitive health screening 
              and make early detection accessible to everyone.
            </p>
          </div>
          
          {/* Conditional Rendering for Loading, Error, and Success states */}
          {isLoading && (
            <div className="flex justify-center items-center p-16">
              <Loader2 className="w-12 h-12 animate-spin text-[#9B177E]" />
            </div>
          )}
          
          {error && (
            <div className="text-center p-16 bg-red-50 rounded-lg">
              <p className="text-red-600 font-semibold">Error loading partners: {error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => {
                const PartnerIcon = getPartnerIcon(partner.type);
                return (
                  <div key={partner.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <PartnerIcon className="w-5 h-5 text-[#9B177E]" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-[#2A1458]">{partner.name}</h3>
                        <span className="text-xs bg-[#FFEAD8] text-[#9B177E] px-2 py-1 rounded-full font-medium">
                          {partner.type}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{partner.description}</p>
                      {/* 
                        NOTE: The 'achievements' section has been removed because this data
                        does not exist in the backend Partner model. You can add an 'achievements'
                        field (e.g., as a JSON or comma-separated string) to your Flask model 
                        and API endpoint if you wish to make this dynamic as well.
                      */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

  {/* Partnership Benefits */}
  <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2A1458] mb-6">
                Why Partner With Us?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#FFEAD8] rounded-full p-2 flex-shrink-0">
                    <Microscope className="w-5 h-5 text-[#9B177E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A1458] mb-2">Cutting-Edge Research</h3>
                    <p className="text-gray-700 text-sm">Access to the latest AI and machine learning technologies for cognitive health research.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-[#E8988A]/30 rounded-full p-2 flex-shrink-0">
                    <Users className="w-5 h-5 text-[#9B177E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A1458] mb-2">Global Impact</h3>
                    <p className="text-gray-700 text-sm">Collaborate on solutions that can help millions of people worldwide.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-[#9B177E]/30 rounded-full p-2 flex-shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A1458] mb-2">Institutional Support</h3>
                    <p className="text-gray-700 text-sm">Comprehensive support for research, implementation, and scaling initiatives.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-[#2A1458]/30 rounded-full p-2 flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A1458] mb-2">Recognition & Publications</h3>
                    <p className="text-gray-700 text-sm">Opportunities for joint publications and recognition in leading journals.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-[#9B177E]/10 to-[#2A1458]/10 rounded-3xl p-8">
                <img 
                  src="/partner.jpeg" 
                  alt="Research collaboration"
                  className="rounded-2xl shadow-xl w-full h-80 object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-[#FFEAD8]">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#9B177E] rounded-full p-2">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2A1458]">Global Network</p>
                    <p className="text-sm text-gray-600">25+ Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#9B177E] to-[#2A1458]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Interested in Partnering With Us?
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Join our network of leading institutions and organizations working to advance 
            cognitive health screening and early detection technologies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#9B177E] px-8 py-4 rounded-full font-semibold hover:bg-[#FFEAD8] transition-all duration-300">
              Partnership Inquiry
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#9B177E] transition-all duration-300">
              Download Partnership Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;