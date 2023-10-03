// abusiveWords.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AbusiveWordsMiddleware implements NestMiddleware {
    // Array of abusive words to check against
    private abusiveWords: string[] = [
        'Fuck',
        'Shit',
        'Piss',
        'Dick',
        'Asshole',
        'Bastard',
        'Bitch',
        'Cunt',
        'Bollocks',
        'Bugger',
        'Bloody',
        'Choad',
        'Crikey',
        'Shag',
        'Wanker',
        'piss',
        'arse',
        'arsehole',
        'tits',
        'balls',
        'bastard',
        'beaver',
        'bitch',
        'bollocks',
        'bonk',
        'bugger',
        'bukkake',
        'bullshit',
        'cack',
        'chuffer',
        'clunge',
        'cock',
        'cocksucker',
        'cockwomble',
        'codger',
        'crap',
        'crikey',
        'cunt',
        'dick',
        'dildo',
        'fuck',
        'fucktard',
        'gash',
        'shite',
        'goddamn',
        'gormless',
        'hobknocker',
        'jizz',
        'knob',
        'knobber',
        'knobend',
        'minge',
        'minger',
        'minging',
        'motherfucker',
        'munter',
        'naff',
        'nitwit',
        'piss',
        'pissed',
        'plonker',
        'ponce',
        'pouf',
        'poxy',
        'prat',
        'prick',
        'prickteaser',
        'punani',
        'punny',
        'pussy',
        'rapey',
        'arsed',
        'shag',
        'shit',
        'shite',
        'shitfaced',
        'skank',
        'slag',
        'slapper',
        'slut',
        'sod',
        'swine',
        'tits',
        'toff',
        'trollop',
        'tuss',
        'twat',
        'twonk',
        'wally',
        'wanker',
        'wankstain',
        'wazzack',
        'whore',
    ];

    use(req: Request, res: Response, next: NextFunction) {
        // Check each key-value pair in the request body
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                const value = req.body[key];

                // Check if value contains abusive words
                if (this.containsAbusiveWords(value)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Abusive words detected.',
                        data: [],
                    });
                }
            }
        }

        next();
    }

    private containsAbusiveWords(value: string): boolean {
        const lowercaseValue = value.toLowerCase();

        for (const abusiveWord of this.abusiveWords) {
            if (lowercaseValue.includes(abusiveWord)) {
                return true;
            }
        }

        return false;
    }
}
