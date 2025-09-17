// WatchProvidersPage.tsx
import React, { useState, useEffect } from 'react';
import common from '../service/common';
import '../upcomingmoives/watchprovider.css'
import { useParams } from 'react-router-dom';
import Footer from '../footer/footer';
import LoginHeader from '../header/loginHeader';
const WatchProviders: React.FC = () => {
    const [providersData, setProvidersData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { movieId } = useParams<{ movieId: string; }>();
    useEffect(() => {
        const fetchProviders = async () => {
            if (!movieId) return;

            try {
                setLoading(true);
                setError(null);
                const data = await common.watchProvider(movieId);
                const response = await data.json();
                console.log("response", response)
                // Get US providers specifically
                const usProviders = response.results?.US;
                if (usProviders) {
                    setProvidersData(usProviders);
                } else {
                    setError('No watch providers available');
                }
            } catch (err) {
                setError('Failed to fetch watch providers');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [movieId]);

    const ProviderSection: React.FC<{
        title: string;
        providers?: any[]
    }> = ({ title, providers }) => {
        if (!providers || providers.length === 0) return null;

        return (
            <>


                <div className="provider-section">
                    <h3>{title}</h3>
                    <div className="providers-grid">
                        {providers.map((provider) => (
                            <div key={provider.provider_id} className="provider-card">
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                                    alt={provider.provider_name}
                                    className="provider-logo"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60/cccccc/999999?text=No+Logo';
                                    }}
                                />
                                <span className="provider-name">{provider.provider_name}</span>
                            </div>
                        ))}
                    </div>
                </div>
               
            </>
        );
    };

    if (loading) {
        return (
            <div className="watch-providers-page">
                <h2>Where to Watch</h2>
                <div className="loading">Loading watch providers...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="watch-providers-page">
                <h2>Where to Watch</h2>
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <>
            <LoginHeader name={'Guest'} userPhoto={''} />
            <div className="watch-providers-page">

                {providersData ? (
                    <div className="providers-container">
                        <ProviderSection title="Stream" providers={providersData.flatrate} />
                        <ProviderSection title="Buy" providers={providersData.buy} />
                        <ProviderSection title="Rent" providers={providersData.rent} />
                        <ProviderSection title="Free" providers={providersData.free} />
                        <ProviderSection title="With Ads" providers={providersData.ads} />

                        {providersData.link && (
                            <div className="external-link">
                                <a
                                    href={providersData.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tmdb-link"
                                >
                                    View all options on TMDB →
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="no-providers">
                        <p>No watch providers available.</p>
                    </div>
                )}
            </div>
            <Footer></Footer>
        </>
    );
};

export default WatchProviders;