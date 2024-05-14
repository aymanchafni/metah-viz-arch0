
##Numeric Optimization
##To come : Combinational Optimization
##The class is supposed to optimize functions with at most 4 variables
import numpy as np

class Optimizer:
        
        def __init__(self, fx, constraints, method, iter_method, nb_iter, nb_iter_1exec, epsilon=0.01) -> None:

                self.fx = fx
                self.constraints = constraints
                self.method = method
                self.iter_method = iter_method
                self.nb_iter = nb_iter
                self.nb_iter_1exec = nb_iter_1exec
                #
                self.epsilon = epsilon




        def run(self):
                return


        def iterate(self, samples_size, current_point, best_point):
                
                if(current_point is not [] and best_point is not []):
                        current_points = self.init_function_values(samples_size)
                        scores = np.apply_along_axis(self.fx, arr = current_points, axis = 1)
                        current_point = current_points[np.argmin(scores),]
                        best_point = current_point
                        score = np.min(scores)
                        best_score = score
                        best_before_score = best_score

             
                
                k=0
                l=0
                while(k<self.nb_iter_1exec):
                                k+=1   
                                current_points = self.init_function_values(samples_size)
                                scores = np.apply_along_axis(self.fx, arr = current_points, axis = 1)

                                score = np.min(scores)
                                current_point = current_points[np.argmin(scores),]          
                                
                                best_before_score = best_score

                                if(score < best_score): 
                                        best_score = score
                                        best_point = current_point
                                

                                if best_before_score - best_score < self.epsilon :
                                        l += 1 
                                else :
                                        l = 0

                                if l == 10 : 
                                    break
                                
     
                    
                return current_point, best_point             

        
        
        def initiate_values(self):
                return 

        
        def init_function_values(self,n):
                #to be reviewed : maybe change the method?
                #initialize values for all vars and their f to draw a 3D graph
                #but only 2 will be used at once on a graph
                
                return np.random.uniform(low=0,high=300,size=[n,4])
        
        def set_constraints(self):
                return
        

        def mutation(self):
                return
        
        def penalty(self):
                return