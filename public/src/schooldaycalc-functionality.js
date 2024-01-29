import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

class Constants {
    static DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    static MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    static RCPS_WEBSITE = "https://www.rcps.us";
}

class DatesFinder {
    constructor() {
        console.log("[  --------- BEGIN DATES SRC FINDER ---------  ]");
        console.log("Searching with base url '" + Constants.RCPS_WEBSITE + "'");
        this.url = null;

        axios.get(Constants.RCPS_WEBSITE)
            .then(response => {
                this.content = response.data;
                console.log("Found " + this.content.split("\n").length + " lines");

                for (const line of this.content.split("\n")) {
                    if (!"/cms/lib/" in line) {
                        continue;
                    }
                    if (!"aDayBDay_Dates" in line) {
                        console.log("Invalid /cms/lib line found: " + line + " (FAILED TO FIND aDayBDay_Dates)");
                        continue;
                    }
                    console.log("Valid /cms/lib line found: " + line);
                    const beginIndex = line.indexOf('src="');
                    console.log("Begin index of 'src=' at " + beginIndex);
                    line = line.substring(beginIndex);
                    console.log("Found URI of file to be at (excluding domain): " + line);
                    this.url = Constants.RCPS_WEBSITE + line.split('"')[1];
                    console.log("New URL set to '" + this.url + "'");
                    break;
                }

                console.log("[  --------- END DATES SRC FINDER ---------  ]");
            })
            .catch(error => {
                console.error(error);
            });
    }

    get_url() {
        return this.url;
    }
}

class RCPSWebsiteReader {
    date_from_text(text) {
        return new Date(text);
    }

    constructor() {
        console.log("----------- BEGIN WEBSITE READER -----------");

        try {
            var url = new DatesFinder().get_url();
            if (this.url === null) {
                throw new Error("URL not defined nor found on RCPS website");
            }

            axios.get(this.url)
                .then(response => {
                    RCPSWebsiteReader.content = response.data;
                    let readingDaysOff = false;
                    RCPSWebsiteReader.daysOff = {};
                    RCPSWebsiteReader.yearStart = null;
                    RCPSWebsiteReader.yearEnd = null;

                    for (const line of this.content.split("\n")) {
                        if (line.includes("ListOfDaysOff =")) {
                            readingDaysOff = true;
                            console.log("---[ Now reading days off and their reason ]---");
                            continue;
                        }

                        if (line.includes("StartOfYearDate =")) {
                            this.yearStart = this.date_from_text(line.split('"')[1]);
                            console.log("The year starts " + this.yearStart);
                        }

                        if (line.includes("LastDayOfExams =")) {
                            this.yearEnd = this.date_from_text(line.split('"')[1]);
                            console.log("The year ends " + this.yearEnd);
                        }

                        if (readingDaysOff) {
                            if (line.includes("]")) {
                                readingDaysOff = false;
                                console.log("Days off: " + JSON.stringify(this.daysOff));
                                console.log("---[ Exiting days off and their reason ]---");
                                continue;
                            }

                            line = line.trim();
                            console.log("Inspecting: " + line);
                            const elements = line.split('\"');
                            if (elements.length !== 5) {
                                console.log("List element does not split properly, ignoring this element.");
                                continue;
                            }

                            const date = elements[1];
                            const reason = elements[3];

                            let valid = false;
                            for (const month of Constants.MONTHS) {
                                if (date.includes(month)) {
                                    valid = true;
                                    break;
                                }
                            }
                            if (!valid) {
                                console.log("Failed to find month in list element, ignoring this element.");
                                continue;
                            }

                            this.daysOff[this.date_from_text(date)] = reason;
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }

        console.log("----------- END WEBSITE READER -----------");
        console.log(" ");
        console.log(" ");
        console.log(" ");
    }

    get_days_off() {
        return this.daysOff;
    }

    get_year_start() {
        return this.yearStart;
    }

    get_year_end() {
        return this.yearEnd;
    }
}

const RCPS_WEBSITE_READER = new RCPSWebsiteReader();