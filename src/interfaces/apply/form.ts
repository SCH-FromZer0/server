interface InterestsFormDetailed {
    part?: string[];
    stack?: string[];
}

interface InterestsForm {
    study?: {
        dev?: InterestsFormDetailed;
        sec?: InterestsFormDetailed;
        other?: string[] | string;
    };
    curriculum?: string[] | null;
}

interface ApplicationFormInput {
    interests: InterestsForm,
    projects: string,
    resolution: string
}

interface ApplicationForm {
    interests: InterestsForm;
    projects: string | null;
    resolution: string | null;
}

export type {
    InterestsForm,
    InterestsFormDetailed,
    ApplicationFormInput,
    ApplicationForm,
}

