import React, { useEffect, useState } from 'react';
import { PlayFill, X, Clock, ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import common from '../service/common';
import { useParams } from 'react-router-dom';
import '../movieView/videoSection.css'
// Define TypeScript interfaces
interface Video {
    id: string;
    title: string;
    description: string;
    duration: string;
    thumbnail: string;
    videoUrl: string;
    category: string;
    views: string;
    uploadDate: string;
}

interface VideoSection {
    title: string;
    videos: Video[];
}


const YouTubeGallery: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [videoData, setVideoData] = useState<VideoSection[]>([]);

    const { movieId } = useParams<{ movieId: any }>();
    const toggleSection = (title: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const openVideo = (video: Video) => {
        setSelectedVideo(video);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedVideo(null);
    };

    useEffect(() => {
        // Fetch or set video data here
        common.moviesVideos(movieId).then(async (response) => {
            const data = await response.json();
            console.log("Video data:", data);
            if (!data.results) return;
            // Transform data to match VideoSection structure
            const sections: VideoSection[] = [
                {
                    title: 'Trailers',
                    videos: data.results
                        .filter((video: any) => video.type === 'Trailer')
                        .map((video: any) => ({
                            id: video.id,
                            title: video.name,
                            description: 'Official Trailer',
                            duration: '3:00', // Placeholder, replace with actual duration if available
                            thumbnail: `https://img.youtube.com/vi/${video.key}/0.jpg`,
                            videoUrl: `https://www.youtube.com/embed/${video.key}`,
                            category: 'Trailer',
                            views: '1M', // Placeholder, replace with actual views if available
                            uploadDate: '2023-01-01' // Placeholder, replace with actual upload date if available
                        })) || []
                },
                {
                    title: 'Clips',
                    videos: data.results
                        .filter((video: any) => video.type === 'Clip')
                        .map((video: any) => ({
                            id: video.id,
                            title: video.name,
                            description: 'Movie Clip',
                            duration: '2:00', // Placeholder, replace with actual duration if available
                            thumbnail: `https://img.youtube.com/vi/${video.key}/0.jpg`,
                            videoUrl: `https://www.youtube.com/embed/${video.key}`,
                            category: 'Clip',
                            views: '500K', // Placeholder, replace with actual views if available
                            uploadDate: '2023-01-02' // Placeholder, replace with actual upload date if available
                        })) || []
                },
                {
                    title: 'Behind the Scenes',
                    videos: data.results
                        .filter((video: any) => video.type === 'Behind the Scenes')
                        .map((video: any) => ({
                            id: video.id,
                            title: video.name,
                            description: 'Behind the Scenes',
                            duration: '5:00', // Placeholder, replace with actual duration if available

                            thumbnail: `https://img.youtube.com/vi/${video.key}/0.jpg`,
                            videoUrl: `https://www.youtube.com/embed/${video.key}`,
                            category: 'Behind the Scenes',
                            views: '200K', // Placeholder, replace with actual views if available
                            uploadDate: '2023-01-03' // Placeholder, replace with actual upload date if available
                        })) || []
                }
            ];
            setVideoData(sections);

        });
    }, [movieId]);

    return (
        <div className="youtube-gallery">
            <header className="gallery-header">
                <h1>Video Gallery</h1>
                <p>Browse and watch our collection of videos</p>
            </header>
            {videoData && (
                <div className="video-sections">
                    {videoData.map(section => (
                        <div key={section.title} className="video-section">
                            <div className="section-header" onClick={() => toggleSection(section.title)}>
                                <h2>{section.title}</h2>
                                <span className="toggle-icon">
                                    {expandedSections[section.title] ? <ChevronUp /> : <ChevronDown />}
                                </span>
                            </div>

                            {expandedSections[section.title] && (
                                <div className="videos-grid">
                                    {section.videos.length > 0 ? "" :
                                        <div className="no-videos">
                                            <p>No {expandedSections[section.title]} available.</p>
                                        </div>}
                                    {section.videos.map(video => (
                                        <div key={video.id} className="video-card" onClick={() => openVideo(video)}>
                                            <div className="video-thumbnail">
                                                <img src={video.thumbnail} alt={video.title} />
                                                <div className="play-overlay">
                                                    <PlayFill className="play-icon" />
                                                </div>
                                                <div className="video-duration">{video.duration}</div>
                                            </div>
                                            <div className="video-info">
                                                <h3 className="video-title">{video.title}</h3>
                                                <p className="video-description">{video.description}</p>
                                                <div className="video-meta">
                                                    <span className="views">{video.views} views</span>
                                                    <span className="upload-date">{video.uploadDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && selectedVideo && (
                <div className="modal-overlay-gallery" onClick={closeModal}>
                    <div className="modal-content-gallery" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>
                            <X />
                        </button>
                        <div className="video-container">
                            <iframe
                                src={selectedVideo.videoUrl}
                                title={selectedVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="video-details">
                            <h2>{selectedVideo.title}</h2>
                            <div className="video-stats">
                                <span className="views">{selectedVideo.views} views</span>
                                <span className="upload-date">{selectedVideo.uploadDate}</span>
                            </div>
                            <p className="video-description">{selectedVideo.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YouTubeGallery;