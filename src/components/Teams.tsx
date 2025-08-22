import React, { useState } from 'react';

interface TeamsProps {
  openModal: (content: any) => void;
  user: any;
}

const Teams: React.FC<TeamsProps> = ({ openModal, user }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    sport: '',
    description: '',
    skillLevel: ''
  });
  const [errors, setErrors] = useState<any>({});

  const myTeams = [
    {
      id: 1,
      name: 'Thunder Bolts',
      sport: 'Football',
      members: 11,
      wins: 8,
      losses: 2,
      role: 'Captain',
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Court Kings',
      sport: 'Basketball',
      members: 7,
      wins: 12,
      losses: 1,
      role: 'Player',
      image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const availableTeams = [
    {
      id: 3,
      name: 'Elite Cricketers',
      sport: 'Cricket',
      members: 9,
      openSlots: 2,
      skillLevel: 'Advanced',
      image: 'https://images.pexels.com/photos/163452/cricket-cricket-player-batsman-sport-163452.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Ace Runners',
      sport: 'Tennis',
      members: 4,
      openSlots: 1,
      skillLevel: 'Intermediate',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!newTeam.name.trim()) {
      newErrors.name = 'Team name is required';
    }
    if (!newTeam.sport) {
      newErrors.sport = 'Sport selection is required';
    }
    if (!newTeam.description.trim()) {
      newErrors.description = 'Team description is required';
    }
    if (!newTeam.skillLevel) {
      newErrors.skillLevel = 'Skill level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleCreateTeam = () => {
    if (!validateForm()) {
      return;
    }
    
    openModal({
      type: 'teamCreated',
      team: {
        ...newTeam,
        id: Date.now(),
        creator: user?.name || 'You',
        members: 1,
        createdAt: new Date().toLocaleDateString()
      }
    });
    
    setShowCreateForm(false);
    setNewTeam({ name: '', sport: '', description: '', skillLevel: '' });
    setErrors({});
  };

  const openTeamDetails = (team) => {
    openModal({
      type: 'teamDetails',
      team: team
    });
  };

  const handleRequestToJoin = (team) => {
    openModal({
      type: 'joinTeamRequest',
      team: team,
      user: user
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setNewTeam({ ...newTeam, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };
  return (
    <section className="py-16 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-12"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">
            Your Teams
          </h2>
          <p className="text-xl text-gray-300 font-inter">
            Manage your teams and discover new ones to join
          </p>
        </div>

        {/* Create Team Button */}
        <div 
          className="mb-8 text-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <i className="fas fa-plus mr-2"></i>
            Create New Team
          </button>
        </div>

        {/* Create Team Form */}
        {showCreateForm && (
          <div 
            className="bg-gray-800 rounded-lg p-8 mb-8 shadow-lg"
            data-aos="fade-up"
          >
            <h3 className="text-2xl font-bold text-white mb-6 font-orbitron">Create New Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Enter team name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sport <span className="text-red-400">*</span>
                </label>
                <select
                  value={newTeam.sport}
                  onChange={(e) => handleInputChange('sport', e.target.value)}
                  className={`w-full bg-gray-700 border ${errors.sport ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="">Select Sport</option>
                  <option value="football">Football</option>
                  <option value="cricket">Cricket</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                </select>
                {errors.sport && <p className="text-red-400 text-sm mt-1">{errors.sport}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill Level <span className="text-red-400">*</span>
                </label>
                <select
                  value={newTeam.skillLevel}
                  onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                  className={`w-full bg-gray-700 border ${errors.skillLevel ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="">Select Skill Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professional">Professional</option>
                </select>
                {errors.skillLevel && <p className="text-red-400 text-sm mt-1">{errors.skillLevel}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500`}
                  rows={3}
                  placeholder="Describe your team"
                ></textarea>
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleCreateTeam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Create Team
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setErrors({});
                  setNewTeam({ name: '', sport: '', description: '', skillLevel: '' });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* My Teams */}
        <div className="mb-12">
          <h3 
            className="text-2xl font-bold text-white mb-6 font-orbitron"
            data-aos="fade-up"
          >
            My Teams
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTeams.map((team, index) => (
              <div
                key={team.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onClick={() => openTeamDetails(team)}
              >
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white font-orbitron">{team.name}</h4>
                    <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">{team.role}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{team.sport}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span><i className="fas fa-users mr-1"></i>{team.members} members</span>
                    <span><i className="fas fa-trophy mr-1"></i>{team.wins}W - {team.losses}L</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Teams to Join */}
        <div>
          <h3 
            className="text-2xl font-bold text-white mb-6 font-orbitron"
            data-aos="fade-up"
          >
            Teams Looking for Players
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTeams.map((team, index) => (
              <div
                key={team.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-lg font-bold text-white mb-2 font-orbitron">{team.name}</h4>
                  <p className="text-gray-300 mb-2">{team.sport}</p>
                  <p className="text-sm text-gray-400 mb-4">Skill Level: {team.skillLevel}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">
                      <i className="fas fa-users mr-1"></i>{team.members} members
                    </span>
                    <span className="text-sm text-emerald-400">
                      {team.openSlots} slots open
                    </span>
                  </div>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-all duration-300">
                    onClick={() => handleRequestToJoin(team)}
                    <i className="fas fa-plus mr-2"></i>
                    Request to Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teams;