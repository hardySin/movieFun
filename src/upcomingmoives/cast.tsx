// pages/ActorPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import common from '../service/common';
import '../upcomingmoives/cast.css'
import LoginHeader from '../header/loginHeader';
import Footer from '../footer/footer';
interface Actor {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: string;
    deathday: string | null;
    gender: number;
    homepage: string | null;
    id: number;
    imdb_id: string;
    known_for_department: string;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
}

const ActorPage: React.FC = () => {
    const [actor, setActor] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { personId } = useParams<{ personId: string; }>();
    const [error, setError] = useState<any>();
    const location = useLocation();

    useEffect(() => {
        const actorInfo = async () => {
            if (!personId) return;
            // Mock data based on your JSON


            try {
                setLoading(true);
                const data = await common.actorProfile(personId);
                const response = await data.json();
                console.log("response", response)
                // Get US providers specifically
                const mockActor = response;
                if (mockActor) {
                    setTimeout(() => {
                        setActor(mockActor);
                        setLoading(false);
                    }, 1000);
                }
                else {
                    setError("Error loading actor profile")
                }
            } catch (err) {
                console.error('Error:', err);
                setError(err)
            } finally {
                setLoading(false);
            }
        }
        actorInfo()
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading actor profile...</p>
            </div>
        );
    }

    if (!actor) {
        return (
            <div className="error-container">
                <h2>Error loading actor profile</h2>
                <p>Please try again later.</p>
            </div>
        );
    }


    interface ActorProfileProps {
        actor: Actor;
    }

    const ActorProfile: React.FC<ActorProfileProps> = ({ actor }) => {
        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const getAge = (birthday: string) => {
            const birthDate = new Date(birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return age;
        };

        const genderText = actor.gender === 2 ? 'Male' : actor.gender === 1 ? 'Female' : 'Unknown';

        return (
            <>
                <LoginHeader name={'Guest'} userPhoto={''} />

                <div className="actor-profile">
                    {/* Hero Section */}
                    <div className="actor-hero">
                        <div className="hero-content">
                            <div className="profile-image-container">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                                    alt={actor.name}
                                    className="profile-image"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750/333333/ffffff?text=No+Image';
                                    }}
                                />
                                <div className="image-overlay"></div>
                            </div>

                            <div className="hero-info">
                                <h1 className="actor-name">{actor.name}</h1>

                                <div className="quick-facts">
                                    <div className="fact">
                                        <span className="fact-label">Born</span>
                                        <span className="fact-value">
                                            {formatDate(actor.birthday)} ({getAge(actor.birthday)} years old)
                                        </span>
                                    </div>

                                    <div className="fact">
                                        <span className="fact-label">From</span>
                                        <span className="fact-value">{actor.place_of_birth}</span>
                                    </div>

                                    <div className="fact">
                                        <span className="fact-label">Gender</span>
                                        <span className="fact-value">{genderText}</span>
                                    </div>

                                    <div className="fact">
                                        <span className="fact-label">Known For</span>
                                        <span className="fact-value">{actor.known_for_department}</span>
                                    </div>

                                    <div className="fact">
                                        <span className="fact-label">Popularity</span>
                                        <span className="fact-value">
                                            {actor.popularity.toFixed(1)}/10
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="actor-content">
                        {/* Biography Section */}
                        <section className="bio-section">
                            <h2>Biography</h2>
                            <div className="bio-text">
                                {actor.biography.split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Also Known As Section */}
                        {actor.also_known_as.length > 0 && (
                            <section className="aka-section">
                                <h2>Also Known As</h2>
                                <div className="aka-tags">
                                    {actor.also_known_as.map((name, index) => (
                                        <span key={index} className="aka-tag">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Additional Info */}
                        <section className="additional-info">
                            <h2>Additional Information</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">IMDb ID</span>
                                    <span className="info-value">
                                        <a
                                            href={`https://www.imdb.com/name/${actor.imdb_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="imdb-link"
                                        >
                                            {actor.imdb_id}
                                        </a>
                                    </span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">TMDB ID</span>
                                    <span className="info-value">{actor.id}</span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Adult Content</span>
                                    <span className="info-value">
                                        {actor.adult ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>


                <Footer />

            </>
        );
    };


    return (
        <div className="actor-page">
            <ActorProfile actor={actor} />
        </div>
    );
};

export default ActorPage;