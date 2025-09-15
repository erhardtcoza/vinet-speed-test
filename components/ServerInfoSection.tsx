
import React from 'react';
import { SpeedTestDetails } from '../types';
import { InfoIcon } from './icons/InfoIcon';
import { ConnectionIcon } from './icons/ConnectionIcon';
import { ServerIcon } from './icons/ServerIcon';
import { NetworkIcon } from './icons/NetworkIcon';
import { IpAddressIcon } from './icons/IpAddressIcon';

interface ServerInfoSectionProps {
    details: SpeedTestDetails;
}

const InfoRow: React.FC<{ icon: React.ReactNode, label: string, value?: string }> = ({ icon, label, value }) => (
    <div className="flex items-center text-sm py-2">
        <div className="w-6 h-6 text-vinet-gray-light mr-3">{icon}</div>
        <div>
            <span className="text-vinet-gray-dark">{label}: </span>
            <span className="font-medium text-vinet-gray-dark">{value}</span>
        </div>
    </div>
);


const ServerInfoSection: React.FC<ServerInfoSectionProps> = ({ details }) => {
    return (
        <div className="my-12 text-left">
            <h2 className="text-2xl font-bold mb-4 text-vinet-gray-dark text-center flex items-center justify-center">
                Server Information
                <InfoIcon className="w-5 h-5 ml-2 text-vinet-gray-light" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 border border-gray-200 rounded-lg">
                <div className="bg-gray-200 rounded-md h-48 md:h-full overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1593629470985-236b2836269b?w=800&h=600&fit=crop&q=80"
                        alt="Map showing server location"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div>
                    <InfoRow icon={<ConnectionIcon />} label="Status" value="Connected via IPv4" />
                    <InfoRow icon={<ServerIcon />} label="Server location" value={details.serverLocation} />
                    <InfoRow icon={<NetworkIcon />} label="Your network" value={details.networkProvider} />
                    <InfoRow icon={<IpAddressIcon />} label="Your IP address" value={details.ipAddress} />
                </div>
            </div>
        </div>
    );
};

export default ServerInfoSection;