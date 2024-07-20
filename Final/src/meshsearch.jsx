import React, { useState } from 'react';

const MeshSearch = ({ meshes, onMeshSelect, onGroupSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeshes, setSelectedMeshes] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMeshClick = (mesh) => {
    onMeshSelect(mesh);
    if (selectedMeshes.includes(mesh)) {
      setSelectedMeshes(selectedMeshes.filter((m) => m !== mesh));
    } else {
      setSelectedMeshes([...selectedMeshes, mesh]);
    }
  };

  const handleGroupCreation = () => {
    onGroupSelect(selectedMeshes);
    setSelectedMeshes([]);
  };

  const filteredMeshes = meshes.filter((mesh) =>
    mesh.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mesh-search">
      <input
        type="text"
        placeholder="Search Mesh"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul className="mesh-list">
        {filteredMeshes.map((mesh) => (
          <li
            key={mesh.id}
            onClick={() => handleMeshClick(mesh)}
            className={selectedMeshes.includes(mesh) ? 'selected' : ''}
          >
            {mesh.name}
          </li>
        ))}
      </ul>
      {selectedMeshes.length > 0 && (
        <button onClick={handleGroupCreation}>Create Group</button>
      )}
    </div>
  );
};

export default MeshSearch;
