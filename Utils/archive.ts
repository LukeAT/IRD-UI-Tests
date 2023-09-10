import * as http from 'http';
//import { NetworkCredential } from 'node:child_process'; // Assuming you have a suitable library for NetworkCredential


class Archive {

    public static archiveAll(user: string, pass: string, apiCall: string = 'http://localhost:3000/api/bid/archiveallthethingsquickly'): void {
        Archive.callEndPoint(user, pass, apiCall);
        Archive.archiveStagedEntries(user, pass);
    }

    public static archiveStagedEntries(user: string, pass: string): void {
        Archive.callEndPoint(user, pass, 'http://localhost:3000/api/import/ArchiveStagedEntries');
    }

    private static callEndPoint(user: string, pass: string, endpoint: string): void {
        const options = {
            method: 'GET',
            auth: `${user}:${pass}`,
        };

        const req = http.request(endpoint, options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                // Process the data if needed
            });
        });

        req.on('error', (error) => {
            console.error(`Request error: ${error.message}`);
        });

        req.end();
    }
}

export default Archive

// Define ApiCalls interface or enum
// interface ApiCalls {
//   ArchiveAll: string;
//   ArchiveJustThisThing: string;
//   ArchiveStagedEntries: string;
// }

// Usage:
// const username: string = 'your_username';
// const password: string = 'your_password';
// const apiEndpoint: string = 'https://example.com/api/resource';

// OtcxApp.ApiRequests.Archive.archiveAll(username, password);
// OtcxApp.ApiRequests.Archive.archiveAllPerId(username, password, '123');
// OtcxApp.ApiRequests.Archive.archiveStagedEntries(username, password);
