const ApiRoutes = {
    upload: {
        deleteFilesByIds: () => "/data/files/delete",
        view: (path: string) => `/data/files/view/${path}`,
        uploadFile: () => "/data/files/upload",
        findAll: () => "/data/files",
        updateMedia: () => "data/files/update"
    },

    getUrl: (path: string) => {
        return process.env.NEXT_PUBLIC_API_URL + path;
    }
}

export default ApiRoutes;