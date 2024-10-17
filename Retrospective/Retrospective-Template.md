TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done `3 vs. 2`
- Total points committed vs. done `13 vs. 8`
- Nr of hours planned vs. spent (as a team) `94h 13m vs. 88h 30m`

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    10    |       |     4d 4h       |      4d 5h 30m        |
| _#1_   |    15     |   3    |    2d 5h       |       2d 5h 45m       |
| _#2_   |    12     |   5    |    3d 43m       |       3d 30m       |
| _#3_   |     7    |    5   |      1d 4h 30m     |       1d 3h 45m       |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
  - estimate: `average: 2.21 hours` `standard deviation: 0.84 hours`
  - actual: `average: 2.23 hours` `standard deviation: 0.90 hours`
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = 0.014 $$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| = 0.037 $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: `12h`
  - Total hours spent: `8h 30m`
  - Nr of automated unit test cases: `49 tests`
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: `2h`
  - Total hours spent: `2h 10m`
- Code review 
  - Total hours estimated: `none`
  - Total hours spent: `none`
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two

- One thing you are proud of as a Team!!