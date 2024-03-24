import pandas  as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler


# REMOVE THE FRAMES WHERE CONFIDENCE OF KEYPOINTS IS LESS THAN 0.85
def conficence_filter(df):
    df = df[df[' confidence'] >= .85].copy()
    return df


# TAKE ONLY POINTS WHERE MODEL WAS ABLE TO SUCCESSFULLY DETECT KEYPOINTS
def success_filter(df):
    df = df[df[' success'] == 1].copy()
    return df


def framesloss(df):
    df = df[df[' timestamp'] % 0.5 == 0].copy()
    return df

def remove_unwanted_columns(df):
    df = df.drop([' confidence'], axis=1)
    df = df.drop([' success'], axis=1)
    df = df.drop([' face_id'], axis=1)
    df = df.drop(['frame'], axis=1)
    return df

def remove_AUs(df):
    df = df.drop([' AU01_r'], axis=1)
    df = df.drop([' AU02_r'], axis=1)
    df = df.drop([' AU04_r'], axis=1)
    df = df.drop([' AU05_r'], axis=1)
    df = df.drop([' AU06_r'], axis=1)
    df = df.drop([' AU07_r'], axis=1)
    df = df.drop([' AU09_r'], axis=1)
    df = df.drop([' AU10_r'], axis=1)
    df = df.drop([' AU12_r'], axis=1)
    df = df.drop([' AU14_r'], axis=1)
    df = df.drop([' AU15_r'], axis=1)
    df = df.drop([' AU17_r'], axis=1)
    df = df.drop([' AU20_r'], axis=1)
    df = df.drop([' AU23_r'], axis=1)
    df = df.drop([' AU25_r'], axis=1)
    df = df.drop([' AU26_r'], axis=1)
    df = df.drop([' AU45_r'], axis=1)
    df = df.drop([' AU01_c'], axis=1)
    df = df.drop([' AU02_c'], axis=1)
    df = df.drop([' AU04_c'], axis=1)
    df = df.drop([' AU05_c'], axis=1)
    df = df.drop([' AU06_c'], axis=1)
    df = df.drop([' AU07_c'], axis=1)
    df = df.drop([' AU09_c'], axis=1)
    df = df.drop([' AU10_c'], axis=1)
    df = df.drop([' AU12_c'], axis=1)
    df = df.drop([' AU14_c'], axis=1)
    df = df.drop([' AU15_c'], axis=1)
    df = df.drop([' AU17_c'], axis=1)
    df = df.drop([' AU20_c'], axis=1)
    df = df.drop([' AU23_c'], axis=1)
    df = df.drop([' AU25_c'], axis=1)
    df = df.drop([' AU26_c'], axis=1)
    df = df.drop([' AU28_c'], axis=1)
    df = df.drop([' AU45_c'], axis=1)
    return df


def remove_unwanted_coordinates(df):
    df = df.loc[:, [' x_17', ' x_36', ' x_21', ' x_39', ' x_44', ' x_46', ' x_38', ' x_40', ' x_50', ' x_58', ' x_51', ' x_57',
                    ' x_52', ' x_56', ' x_61', ' x_62', ' x_63', ' x_67', ' x_66', ' x_65', ' x_54', ' x_48',
                    ' y_17', ' y_36', ' y_21', ' y_39', ' y_44', ' y_46', ' y_38', ' y_40', ' y_50', ' y_58', ' y_51', ' y_57',
                    ' y_52', ' y_56', ' y_61', ' y_62', ' y_63', ' y_67', ' y_66', ' y_65', ' y_54', ' y_48']].copy()
    return df


# ECULIDEAN DISTANCE


# CALCULATING THE OUTER BROW HEIGHT

def calculate_OBH(df):
    df['OBH'] = ((df[' x_36'] - df[' x_17'])**2 + (df[' y_36'] - df[' y_17'])**2)**0.5
    return df


# CALCULATING THE INNER BROW HEIGHT
def calculate_IBH(df):
    df['IBH'] = ((df[' x_39'] - df[' x_21'])**2 + (df[' y_39'] - df[' y_21'])**2)**0.5
    return df

# CALCULATING THE LEFT EYE OPEN
def calculate_LEO(df):
    df['LEO'] = ((df[' x_46'] - df[' x_44'])**2 + (df[' y_46'] - df[' y_44'])**2)**0.5
    return df

# CALCULATING THE RIGHT EYE OPEN
def calculate_REO(df):
    df['REO'] = ((df[' x_40'] - df[' x_38'])**2 + (df[' y_40'] - df[' y_38'])**2)**0.5
    return df

# CALCULATING THE OUTER LIP HEIGHT
def calculate_OLH(df):
    # Calculate Euclidean distances for each set of data points
    d1 = ((df[' x_58'] - df[' x_50'])**2 + (df[' y_58'] - df[' y_50'])**2)**0.5
    d2 = ((df[' x_57'] - df[' x_51'])**2 + (df[' y_57'] - df[' y_51'])**2)**0.5
    d3 = ((df[' x_56'] - df[' x_52'])**2 + (df[' y_56'] - df[' y_52'])**2)**0.5

    # Take the average of the distances
    df['OLH'] = (d1+d2+d3) / 3
    return df


def calculate_ILH(df):
    # Calculate Euclidean distances for each set of data points
    d1 = ((df[' x_67'] - df[' x_61'])**2 + (df[' y_67'] - df[' y_61'])**2)**0.5
    d2 = ((df[' x_66'] - df[' x_62'])**2 + (df[' y_66'] - df[' y_62'])**2)**0.5
    d3 = ((df[' x_65'] - df[' x_63'])**2 + (df[' y_65'] - df[' y_63'])**2)**0.5

    # Take the average of the distances
    df['ILH'] = (d1+d2+d3) / 3
    return df


def smile(df):
    df['smile'] = ((df[' x_48'] - df[' x_54'])**2 + (df[' y_48'] - df[' y_54'])**2)**0.5
    return df



def load_data():
        facial_keypoints = pd.read_csv('processed/recorded_video.csv')
        return facial_keypoints

def clean_data(facial_keypoints):
    scaler = MinMaxScaler()
    # CLEARENCE
    # facial_keypoints = framesloss(facial_keypoints)
    facial_keypoints = success_filter(facial_keypoints)
    facial_keypoints =  conficence_filter(facial_keypoints)
    facial_keypoints = remove_unwanted_columns(facial_keypoints)
    facial_keypoints = remove_AUs(facial_keypoints)
    facial_keypoints = remove_unwanted_coordinates(facial_keypoints)



    # CALCULATING THE FEATURES
    
    facial_keypoints = calculate_OBH(facial_keypoints)
    facial_keypoints = calculate_IBH(facial_keypoints)
    facial_keypoints = calculate_LEO(facial_keypoints)
    facial_keypoints = calculate_REO(facial_keypoints)
    facial_keypoints = calculate_OLH(facial_keypoints)
    facial_keypoints = calculate_ILH(facial_keypoints)
    facial_keypoints = smile(facial_keypoints)


    facial_keypoints = facial_keypoints.loc[:, ['OBH', 'IBH', 'LEO', 'REO', 'OLH', 'ILH', 'smile']].copy()
    facial_keypoints = scaler.fit_transform(facial_keypoints)
    facial_keypoints = pd.DataFrame(facial_keypoints, columns=['OBH', 'IBH', 'LEO', 'REO', 'OLH', 'ILH', 'smile'])
    # print(facial_keypoints.head())
    # print(facial_keypoints.shape)

    return facial_keypoints


def take_avg(facial_keypoints):
    average_values = facial_keypoints.mean()
    average_array = np.array(average_values)
    average_array_2d = average_array.reshape(1, -1)

    return(average_array_2d)



if __name__ == "__main__":
    take_avg(clean_data(load_data()))
    

