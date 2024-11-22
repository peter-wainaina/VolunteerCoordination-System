import React, { useState, useEffect } from 'react';
import './OpportunityModal.css';

const OpportunityModal = ({ isOpen, onClose, currentOpportunity, onSubmit, organizationId }) => {
    const [formData, setFormData] = useState({
        title: '',
        organization: '',
        organization_id: organizationId,
        location: '',
        type: '',
        date: '',
        skills: '',
        availability: '',
        description: '',
        status: 'upcoming',
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (currentOpportunity) {
            setFormData({
                title: currentOpportunity.title,
                organization: currentOpportunity.organization,
                organization_id: currentOpportunity.organization_id || organizationId,
                location: currentOpportunity.location,
                type: currentOpportunity.type,
                date: formatDate(currentOpportunity.date),
                skills: currentOpportunity.skills,
                availability: currentOpportunity.availability,
                description: currentOpportunity.description,
                status: currentOpportunity.status,
            });
        } else {
            setFormData({
                title: '',
                organization: '',
                organization_id: organizationId,
                location: '',
                type: '',
                date: '',
                skills: '',
                availability: '',
                status: '',
                description: '',
            });
        }
    }, [currentOpportunity, organizationId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal">
                    <h2>{currentOpportunity ? 'Update Opportunity' : 'Create Opportunity'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="title">Role Title</label>
                                <input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="organization">Organization</label>
                                <input
                                    id="organization"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Type</label>
                                <input
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="skills">Skills</label>
                                <input
                                    id="skills"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="availability">Availability</label>
                                <select
                                    id="availability"
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Weekdays">Weekdays</option>
                                    <option value="Weekends">Weekends</option>
                                    <option value="Flexible">Flexible</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {currentOpportunity ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default OpportunityModal;